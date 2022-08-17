import { Validator } from "../types/types";
import { ValidationError } from "../errors";

/**
 * @TODO : Use hapi-joi or express-validator if robust validation is required
 */

export const validate: Validator = ({ variantId, pincode }) => {
  if (variantId && Number.isNaN(variantId)) {
    return new ValidationError("variantId", "Please Provide valid VariantId");
  }

  if (!pincode || Number.isNaN(pincode)) {
    return new ValidationError("pincode", "Please Provide valid Pin Code");
  }

  return false;
};
