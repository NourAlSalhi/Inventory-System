import express from "express";
import cors from "cors";
import inventoryRoutes from "./api/inventory/inventory.routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", inventoryRoutes);



export default app;
