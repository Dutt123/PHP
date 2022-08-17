// @ts-nocheck
import * as crypto from "crypto";
import { NextFunction, Request, Response } from "express";

export const verifyWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawBody = req["rawBody"];

    if (typeof rawBody == "undefined") {
      throw new Error(
        "validateShopifySignature: req.rawBody is undefined. Please make sure the raw request body is available as req.rawBody."
      );
    }

    const hmac = req.headers["x-shopify-hmac-sha256"];

    const hash = crypto
      .createHmac("sha256", SHOPIFY_SIGNATURE_SECRET)
      .update(rawBody)
      .digest("base64");

    const signatureOk = crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(hmac)
    );
    if (!signatureOk) {
      res.status(403);
      res.send("Unauthorized");
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};
