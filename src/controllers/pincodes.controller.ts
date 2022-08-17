import { NextFunction, Request, RequestHandler, Response } from "express";
import csv from "csvtojson";
import { buildBulkInsertData } from "../services/pincodes.service";
import { CsvPincode } from "../types/pincodes";
import { getRepository, In } from "typeorm";
import { Pincode } from "../models/Pincode";
import PaginateService from "../services/paginate.service";

export const importFromCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincodes = (await csv({
      noheader: false,
      headers: [
        "pincode",
        "city",
        "state",
        "warehouse",
        "serviceable",
        "delivery_days",
      ],
    }).fromFile(req.body.csv)) as CsvPincode[];

    const insertData = await buildBulkInsertData(pincodes);

    /** Clear current Pincodes data completely */
    await getRepository(Pincode).clear();

    /** Insert new Pincode Records **/
    await getRepository(Pincode).insert(insertData);

    return res.json({
      message: "Pincodes Inserted Successfully!",
    });
  } catch (e) {
    next(e);
  }
};

// export const get = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     PaginateService.getData(req.body, (rows: any, lastRow: any) => {
//       res.json({ rows: rows, lastRow: lastRow });
//     });
//   } catch (e) {
//     next(e);
//   }
// };

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ids: number[] = req.params.ids
      .split(",")
      .map((id) => parseInt(id.trim()));

    await getRepository(Pincode).delete({
      id: In(ids),
    });

    return res.json({
      message: "Pincode(s) removed successfully!",
    });
  } catch (e) {
    next(e);
  }
};
