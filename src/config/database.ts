import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "Inventory",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false
  }
);

export default sequelize;
