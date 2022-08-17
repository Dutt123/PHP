import { createConnection } from "typeorm";
import { Location } from "../models/Location";
import { Pincode } from "../models/Pincode";
import { Admin } from "../models/Admin";

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// export const connect = new Promise((resolve, reject) => {
//   resolve("Just a Temporary function to mock Database Connection");
// });

export const connect = createConnection({
  type: "mssql",
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT ? parseInt(DB_PORT) : 3306,
  synchronize: false,
  entities: [Location, Pincode, Admin],
  // options: {
  //   encrypt: true,
  // },
});
