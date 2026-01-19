import { Router } from "express";
import { Location } from "../../db/models";

const router = Router();

router.get("/", async (req, res) => {
  const type = req.query.type as string;

  if (!type || !["warehouse", "store"].includes(type)) {
    return res.status(400).json({ message: "Invalid or missing type" });
  }

  try {
    const locations = await Location.findAll({
      where: { type },
      attributes: ["id", "name", "type", "max_capacity"],
    });
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error });
  }
});

export default router;
