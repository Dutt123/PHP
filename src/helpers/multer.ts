import { existsSync, mkdirSync } from "fs";
import path from "path";
import { ValidationError } from "../errors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Options } from "multer";

const UPLOADS_DIR = "uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);

    let fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    req.body[file.fieldname] = `${UPLOADS_DIR}/${fileName}`;
    cb(null, fileName);
  },
});

const filter: Options["fileFilter"] = (req, file, cb) => {
  const allowed = [".csv"];
  const extension = path.extname(file.originalname);

  console.log(extension, allowed.includes(extension));

  if (allowed.includes(extension)) {
    return cb(null, true);
  }

  return cb(new ValidationError("csv", "Error! Please Provide valid file."));
};

export const upload = () => {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, {});
  }

  return multer({
    storage: storage,
    fileFilter: filter,
  });
};
