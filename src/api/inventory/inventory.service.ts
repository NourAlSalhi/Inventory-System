import { Product, Location, Inventory, Transfer } from "../../db/models";
import sequelize from "../../config/database";

export const getInventoryByLocation = async (locationId: number) => {
  const inventory = await Inventory.findAll({
    where: { location_id: locationId },
    include: [{ 
      model: Product, 
      as: 'Product',
      attributes: ["id", "name", "sku"] 
    }],
    attributes: ["quantity", "product_id"],
  });

  return inventory.map((item: any) => {
    const productData = item.Product; 
    
    return {
      product_id: item.product_id,
      product_name: productData?.name || "Unknown",
      sku: productData?.sku || "Unknown",
      quantity: item.quantity,
    };
  });
};

export const getProducts = () => {
  return Product.findAll({
    attributes: ["id", "name", "sku"],
  });
}

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
    const fromLocation = await Location.findByPk(from_location_id, { transaction: t });
    const toLocation = await Location.findByPk(to_location_id, { transaction: t });

    if (!fromLocation || !toLocation) {
      throw new Error("Invalid location");
    }

    const sourceInventory = await Inventory.findOne({
      where: { product_id, location_id: from_location_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!sourceInventory || sourceInventory.quantity < quantity) {
      throw new Error("Not enough stock");
    }

    if (toLocation.type === "store") {
      const total = await Inventory.sum("quantity", {
        where: { location_id: to_location_id },
        transaction: t,
      });

      if (total + quantity > (toLocation.max_capacity || 50)) {
        throw new Error("Store capacity exceeded");
      }
    }

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

    sourceInventory.quantity -= quantity;
    await sourceInventory.save({ transaction: t });

    const targetInventory = await Inventory.findOne({
      where: { product_id, location_id: to_location_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (targetInventory) {
      targetInventory.quantity += quantity;
      await targetInventory.save({ transaction: t });
    } else {
      await Inventory.create(
        { product_id, location_id: to_location_id, quantity },
        { transaction: t }
      );
    }

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
