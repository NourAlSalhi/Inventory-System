import app from "./app";
import sequelize from "./config/database";

const PORT = 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to DB:", error);
  }
};

startServer();
