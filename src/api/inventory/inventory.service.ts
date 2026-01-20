import { Product, Location, Inventory, Transfer } from "../../db/models";
import sequelize from "../../config/database";

export const getInventoryByLocation = async (locationId: number) => {
  const inventory = await Inventory.findAll({
    where: { location_id: locationId },
    include: [
      {
        model: Product,
        as: "Product",
        attributes: ["id", "name", "sku"],
      },
    ],
    attributes: ["quantity", "product_id"],
  });

  // return inventory.map((item: any) => ({
  //   product_id: item.product_id,
  //   product_name: item.Product?.name,
  //   sku: item.Product?.sku,
  //   quantity: item.quantity,
  // }));

  return inventory.map((item: any) => ({
    item,
  }));
};

export const getProducts = () => {
  return Product.findAll({
    attributes: ["id", "name", "sku"],
  });
};

export const getLocations = async (type?: string) => {
  return Location.findAll({
    where: type ? { type } : undefined,
    attributes: ["id", "name", "type", "max_capacity"],
  });
};

export const transferStock = async (payload: {
  product_id: number;
  from_location_id: number;
  to_location_id: number;
  quantity: number;
}) => {
  const { product_id, from_location_id, to_location_id, quantity } = payload;

  if (from_location_id === to_location_id) {
    throw new Error("Cannot transfer to the same location");
  }

  const t = await sequelize.transaction();

  try {
    /* 1️⃣ Load locations */
    const fromLocation = await Location.findByPk(from_location_id, {
      transaction: t,
    });
    const toLocation = await Location.findByPk(to_location_id, {
      transaction: t,
    });

    if (!fromLocation || !toLocation) {
      throw new Error("Invalid location");
    }

    /* 2️⃣ Check source inventory (per product) */
    const sourceInventory = await Inventory.findOne({
      where: { product_id, location_id: from_location_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!sourceInventory || sourceInventory.quantity < quantity) {
      throw new Error("Not enough stock");
    }

    /* 3️⃣ Load target inventory (per product) */
    const targetInventory = await Inventory.findOne({
      where: { product_id, location_id: to_location_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const targetProductQuantity = (targetInventory?.quantity || 0) + quantity;

    /* 4️⃣ Check location capacity (AFTER product validation) */
    if (toLocation.type === "store") {
      const totalQuantity = await Inventory.sum("quantity", {
        where: { location_id: to_location_id },
        transaction: t,
      });

      const safeTotal = totalQuantity || 0;

      if (safeTotal + quantity > (toLocation.max_capacity || 50)) {
        throw new Error("Store capacity exceeded");
      }
    }

    /* 5️⃣ Create transfer record (pending) */
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

    /* 6️⃣ Update source inventory */
    sourceInventory.quantity -= quantity;
    await sourceInventory.save({ transaction: t });

    /* 7️⃣ Update target inventory */
    if (targetInventory) {
      targetInventory.quantity = targetProductQuantity;
      await targetInventory.save({ transaction: t });
    } else {
      await Inventory.create(
        {
          product_id,
          location_id: to_location_id,
          quantity,
        },
        { transaction: t }
      );
    }

    /* 8️⃣ Complete transfer */
    transfer.status = "completed";
    transfer.completed_at = new Date();
    await transfer.save({ transaction: t });

    await t.commit();
    return transfer;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
