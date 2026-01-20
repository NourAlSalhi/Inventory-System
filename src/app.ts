import express from "express";
import cors from "cors";
import inventoryRoutes from "./api/inventory/inventory.routes";

const app = express();
app.use(cors());
app.use("/api", inventoryRoutes);

app.use(express.json());

export default app;
