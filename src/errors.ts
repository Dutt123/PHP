import { Request, Response, NextFunction, Errback } from "express";

export class ApiError extends Error {
  constructor(public data: any, public status: number = 500) {
    super();
    this.data = data;
    this.status = status;
  }
}

export class ValidationError extends ApiError {
  constructor(key: string, message: string) {
    super(
      {
        key: key,
        message: message,
      },
      422
    );
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Unauthorized Access") {
    super({ message: message }, 401);
  }
}

export const handler = (
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError || err instanceof ValidationError) {
    return res.status(err.status).json(err.data);
  }

  res.status(500).json({ message: "Some Error Occurred!" });
};
