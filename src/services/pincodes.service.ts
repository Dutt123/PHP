import { Pincode } from "../models/Pincode";
import { CsvPincode } from "../types/pincodes";
import { ValidationError } from "../errors";
import { getRepository } from "typeorm";
import { Location } from "../models/Location";

const validate = (
  pincode: CsvPincode,
  allowedWarehouses: string[]
): boolean => {
  return !(
    !pincode.pincode ||
    !pincode.state ||
    !pincode.city ||
    !pincode.serviceable ||
    !pincode.warehouse ||
    !pincode.delivery_days ||
    /** If user has provided warehouse other than we have stored in our Database, We should not allow it */
    !allowedWarehouses.includes(pincode.warehouse)
  );
};

export const buildBulkInsertData = async (
  data: CsvPincode[]
): Promise<CsvPincode[]> => {
  let insertData: CsvPincode[] = [];
  const errorPositions: number[] = [];

  const warehouses = (await getRepository(Location).find()).map(
    (location) => location.warehouse
  );

  data.forEach((pincode, index) => {
    const row = index + 1;

    if (!validate(pincode, warehouses)) {
      errorPositions.push(row);
      return;
    }

    insertData.push(pincode);
  });

  if (errorPositions.length) {
    throw new ValidationError(
      "csv",
      `Please provide valid data at position(s) : ${errorPositions.toString()}`
    );
  }

  return insertData;
};
