import { Router } from "express";
import { Product, Location, Inventory, Transfer } from "../../db/models";
import sequelize from "../../config/database";

const router = Router();

router.post("/", async (req, res) => {
  const { product_id, from_location_id, to_location_id, quantity } = req.body;

  if (!product_id || !from_location_id || !to_location_id || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (from_location_id === to_location_id) {
    return res
      .status(400)
      .json({ message: "Cannot transfer to the same location" });
  }

  // Transaction
  const t = await sequelize.transaction();

  try {
    const fromLocation = await Location.findByPk(from_location_id, { transaction: t });
    const toLocation = await Location.findByPk(to_location_id, { transaction: t });

    if (!fromLocation || !toLocation) throw new Error("Invalid location ID");

    // Validation: only Warehouse <-> Store
    const allowedTypes =
      (fromLocation.type === "warehouse" && toLocation.type === "store") ||
      (fromLocation.type === "store" && toLocation.type === "warehouse");

    if (!allowedTypes) throw new Error("Transfers allowed only between Warehouse and Store");

    // Lock source inventory row
    const sourceInventory = await Inventory.findOne({
      where: { product_id, location_id: from_location_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!sourceInventory || sourceInventory.quantity < quantity) {
      throw new Error("Not enough stock in source location");
    }

    // Lock target inventory row (if exists)
    const targetInventory = await Inventory.findOne({
      where: { product_id, location_id: to_location_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // Validation: check store capacity
    if (toLocation.type === "store") {
      const totalQuantity = await Inventory.sum("quantity", {
        where: { location_id: to_location_id },
        transaction: t,
      });

      if (totalQuantity + quantity > (toLocation.max_capacity || 50)) {
        throw new Error("Target store capacity exceeded");
      }
    }

    // Create transfer with pending status
    const transfer = await Transfer.create(
      {
        transfer_ref: `TR-${Date.now()}`,
        product_id,
        from_location_id,
        to_location_id,
        quantity,
        status: "pending",
      },
      { transaction: t }
    );

    // Update inventories
    sourceInventory.quantity -= quantity;
    await sourceInventory.save({ transaction: t });

    if (targetInventory) {
      targetInventory.quantity += quantity;
      await targetInventory.save({ transaction: t });
    } else {
      await Inventory.create(
        { product_id, location_id: to_location_id, quantity },
        { transaction: t }
      );
    }

    // Complete transfer
    transfer.status = "completed";
    transfer.completed_at = new Date();
    await transfer.save({ transaction: t });

    await t.commit();
    res.status(200).json({ message: "Transfer completed", transfer });
  } catch (error: any) {
    await t.rollback();

    // سجل الفشل في transfer table
    await Transfer.create({
      transfer_ref: `TR-${Date.now()}`,
      product_id,
      from_location_id,
      to_location_id,
      quantity,
      status: "failed",
      failure_reason: error.message,
      requested_at: new Date(),
      completed_at: new Date(),
    });

    res.status(400).json({ message: "Transfer failed", error: error.message });
  }
});

export default router;
