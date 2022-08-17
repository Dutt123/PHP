import { NextFunction, Request, Response } from "express";
import { shopify } from "../config/shopify";
import { validate } from "../validators/check-availability.validator";
import { ApiError, ValidationError } from "../errors";
import { Pincode } from "../models/Pincode";
import { getRepository } from "typeorm";
import { Location } from "../models/Location";
import {
  ICheckAvailabilityResponse,
  ICheckAvailabilityStatus,
  ICheckAvailabilitySuccessResponse,
} from "../types/types";

const response = (
  status: ICheckAvailabilityStatus,
  message: string
): ICheckAvailabilityResponse => {
  return {
    status: status,
    message: message,
  };
};

export const welcome = (req: Request, res: Response) => {
  res.json({ message: "Connected to Kohler API" });
};

export const checkAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = validate(req.body);

    if (validation instanceof ValidationError) {
      next(validation);
      return;
    }

    try {
      const orders = await shopify.order.list({ limit: 5 });
      console.log("LAST_ORDERS", orders.length);
      return res.json(orders);
    } catch (err) {
      console.error("LAST_ORDER_ERRORS", err);
    }

    const { pincode, variantId } = req.body;

    /**
     * Check if Pincode is available in out database, and it's serviceable
     */
    const pincodeData = await getRepository(Pincode).findOne({
      where: { pincode: pincode },
    });

    if (!pincodeData) {
      return res.json(
        response(
          "NOT_DELIVERABLE",
          `Sorry, we don't deliver here. (PinCode : ${pincode})`
        )
      );
    }

    if (!variantId) {
      /** If no variantId is provided it means we want to check availability only for the Pincode and not any variant */
      return res.json(response("DELIVERABLE", "Your Pincode is deliverable!"));
    }

    /**
     * Removed for Temporary purpose.
     *
     * if (!pincodeData.serviceable) {
     *       return res.json(
     *         response(
     *           "NOT_SERVICEABLE",
     *           "Sorry, but your area is currently not serviceable"
     *         )
     *       );
     *     }
     */

    /**
     * Get Location connected to Given Pincode
     */

    const location = await getRepository(Location).findOne({
      where: {
        // @ts-ignore
        warehouse: pincodeData.warehouse,
      },
    });

    if (!location) {
      /** There was some internal error because there must be a location mapped to Pincode */
      throw new ApiError({ message: "Some Error Occurred!" });
    }

    let variant;

    try {
      variant = await shopify.productVariant.get(variantId);
    } catch (e) {
      console.error("ShopifyVariantGetError", e);
      throw new ValidationError("variantId", "No variant exists with given Id");
    }

    let inventoryLevels;

    try {
      inventoryLevels = await shopify.inventoryLevel.list({
        inventory_item_ids: variant.inventory_item_id.toString(),
        location_ids: location.location_id.toString(),
      });
    } catch (err) {
      console.error("InventoryLevelList", err);
    }

    if (!inventoryLevels.length) {
      return res.json(
        response(
          "NOT_SERVICEABLE",
          "Sorry, your area is currently not serviceable."
        )
      );
    }

    const inventoryLevel = inventoryLevels[0];

    if (!inventoryLevel.available) {
      /** 0 Quantities are available at selected Pincode */
      return res.json({
        ...response(
          "OUT_OF_STOCK",
          "Sorry, this product is currently out of stock in your area."
        ),
        available_quantity: inventoryLevel.available,
      });
    }

    res.json({
      ...response(
        "DELIVERABLE",
        `${inventoryLevel.available} quantities are available to deliver at your location.`
      ),
      available_quantity: inventoryLevel.available,
      delivery_days: pincodeData.delivery_days,
      warehouse: pincodeData.warehouse,
    } as ICheckAvailabilitySuccessResponse);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
