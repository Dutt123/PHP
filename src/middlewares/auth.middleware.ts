import { AuthenticationError } from "../errors";
import { NextFunction, Request, Response } from "express";
import { IJwtPayload } from "../types/auth";
import { verify } from "jsonwebtoken";

export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.get("Authorization");

    if (!header) {
      throw new AuthenticationError();
    }

    const token = header.split(" ")[1];
    if (!token) throw new AuthenticationError();

    let decodedToken = verify(token, process.env.JWT_SECRET) as IJwtPayload;

    if (!decodedToken) {
      throw new AuthenticationError();
    }

    // @ts-ignore
    req.admin_id = decodedToken.id;
    next();
  } catch (e) {
    next(e);
  }
};
