import pool from "./config/db.js";

try {
  const connection = await pool.getConnection();

  console.log("✅ Connected to MySQL!");

  const [rows] = await connection.query("SELECT DATABASE() AS db");

  console.log(rows);

  connection.release();
} catch (error) {
  console.error("❌ Connection failed");
  console.error(error);
}