import { Router } from "express";
import * as controller from "./inventory.controller";

const router = Router();

router.get("/products", controller.getProducts);
router.get("/inventory/:locationId", controller.getInventory);
router.get("/locations", controller.getLocations);
router.post("/transfers", controller.transfer);

export default router;
