import { Request, Response } from "express";
import * as service from "./inventory.service";
import { success, failure } from "../../common/response";
import { MESSAGES } from "../../common/messages";
import { isValidId, validateTransferPayload } from "../../common/validators";

export const getInventory = async (req: Request, res: Response) => {
  const locationId = Number(req.params.locationId);

  if (!isValidId(locationId)) {
    return failure(res, MESSAGES.INVENTORY.INVALID_LOCATION);
  }

  try {
    const data = await service.getInventoryByLocation(locationId);
    success(res, data, MESSAGES.INVENTORY.FETCH_SUCCESS);
  } catch (e: any) {
    failure(res, e.message, 500);
  }
};

export const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await service.getProducts();
    success(res, products, MESSAGES.PRODUCTS.FETCH_SUCCESS);
  } catch {
    failure(res, MESSAGES.COMMON.SERVER_ERROR, 500);
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const data = await service.getLocations(type);
    success(res, data, MESSAGES.LOCATIONS.FETCH_SUCCESS);
  } catch (e: any) {
    failure(res, e.message, 500);
  }
};

export const transfer = async (req: Request, res: Response) => {
  const validationError = validateTransferPayload(req.body);

  if (validationError) {
    return failure(res, validationError);
  }

  try {
    const data = await service.transferStock(req.body);
    success(res, data, MESSAGES.TRANSFER.SUCCESS);
  } catch (e: any) {
    failure(res, e.message);
  }
};
