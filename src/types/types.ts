import { ValidationError } from "../errors";

export type Validator = (data: any) => ValidationError | false;

/** Check Availability **/

export declare type NOT_DELIVERABLE = "NOT_DELIVERABLE";
export declare type NOT_SERVICEABLE = "NOT_SERVICEABLE";
export declare type DELIVERABLE = "DELIVERABLE";
export declare type OUT_OF_STOCK = "OUT_OF_STOCK";

export type ICheckAvailabilityStatus =
  | NOT_DELIVERABLE
  | NOT_SERVICEABLE
  | DELIVERABLE
  | OUT_OF_STOCK;

export interface ICheckAvailabilityResponse {
  status: ICheckAvailabilityStatus;
  message: string;
}

export interface ICheckAvailabilitySuccessResponse
  extends ICheckAvailabilityResponse {
  available_quantity: number;
  delivery_days: number;
  warehouse: string;
}
