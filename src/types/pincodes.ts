import { Pincode } from "../models/Pincode";

export type CsvPincode = Omit<
  Pincode,
  "id" | "location" | "created_at"
>;
