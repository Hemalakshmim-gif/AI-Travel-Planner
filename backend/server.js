import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("=================================");
    console.log("✅ TiDB DATABASE CONNECTED");
    console.log("=================================");

    connection.release();

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error("=================================");
    console.error("❌ TiDB DATABASE CONNECTION FAILED");
    console.error("=================================");
    console.error(error.message);
  }
};

startServer();