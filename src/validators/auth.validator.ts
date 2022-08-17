import { Validator } from "../types/types";
import { ValidationError } from "../errors";

/**
 * @TODO : Use hapi-joi or express-validator if robust validation is required
 */

export const validate: Validator = ({ username, password }) => {
  if (!username) {
    return new ValidationError("username", "Please Provide valid Username");
  }

  if (!password || Number.isNaN(password)) {
    return new ValidationError("password", "Please Provide valid Password");
  }

  return false;
};
