import { Router } from "express";
import { Product } from "../../db/models";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({ attributes: ["id", "name", "sku"] });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

export default router;
