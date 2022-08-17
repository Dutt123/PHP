import { NextFunction, Request, Response } from "express";
import { validate } from "../validators/auth.validator";
import { ValidationError } from "../errors";
import { Admin } from "../models/Admin";
import { getRepository } from "typeorm";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { IJwtPayload } from "../types/auth";

interface ILoginResponse {
  admin: Omit<Admin, "password">;
  token: string;
}

export const login = async (
  req: Request,
  res: Response<ILoginResponse>,
  next: NextFunction
) => {
  const validation = validate(req.body);

  if (validation instanceof ValidationError) {
    next(validation);
  }

  const { username, password } = req.body;

  try {
    let admin = await getRepository(Admin).findOne({
      username: username,
    });

    if (!admin) {
      /** No Admin found with given Username */
      throw new ValidationError("username", "Username does not exists!");
    }

    if (!compareSync(password, admin.password)) {
      throw new ValidationError("password", "Please enter Valid Password");
    }

    const token = sign({ id: admin.id } as IJwtPayload, process.env.JWT_SECRET);
    delete admin.password;
    return res.json({ admin: admin, token: token });
  } catch (e) {
    next(e);
  }
};

export const profile = async (
  req: Request,
  res: Response<Omit<Admin, "password">>,
  next: NextFunction
) => {
  try {
    const admin = await getRepository(Admin).findOne({
      where: {
        //@ts-ignore
        id: req.admin_id,
      },
    });

    /** @TODO : Add Scope in Admin model to get Admin Data without Password */
    delete admin.password;

    return res.json(admin);
  } catch (e) {
    next(e);
  }
};
