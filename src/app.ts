import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import "reflect-metadata";
import { router } from "./router";
import { connect } from "./config/database";
import { handler as errorHandler } from "./errors";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(process.env.API_PREFIX, router);
app.use(errorHandler);

connect
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database Error :: ", error);
  });
