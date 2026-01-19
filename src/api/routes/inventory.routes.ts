import { Router } from "express";
import { Inventory, Product } from "../../db/models";

const router = Router();

// GET /api/inventory/:location_id
router.get("/:location_id", async (req, res) => {
  const location_id = parseInt(req.params.location_id);

  if (isNaN(location_id)) {
    return res.status(400).json({ message: "Invalid location ID" });
  }

  try {
    const inventory = await Inventory.findAll({
      where: { location_id },
      include: [{ model: Product, attributes: ["id", "name", "sku"] }],
      attributes: ["quantity"],
    });

    const result = (inventory as (Inventory & { Product?: Product })[]).map((item) => ({
        product_id: item.product_id,
        product_name: item.Product?.name,
        sku: item.Product?.sku,
        quantity: item.quantity,
      }));
      

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
});

export default router;
