import express from "express";
import transferRoutes from "./api/routes/transfer.routes";
import productRoutes from "./api/routes/product.routes";
import locationRoutes from "./api/routes/location.routes";
import inventoryRoutes from "./api/routes/inventory.routes";

const app = express();
app.use(express.json());

app.use("/api/transfers", transferRoutes);
app.use("/api/products", productRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/inventory", inventoryRoutes);

export default app;
