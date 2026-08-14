import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// TiDB SSL Certificate
// =====================================================
//
// LOCAL:
// Uses backend/certs/tidb-ca.pem
//
// RENDER:
// Uses TIDB_CA_CERT environment variable
// =====================================================

let caCertificate;

if (process.env.TIDB_CA_CERT) {
  // Render / Production
  caCertificate = process.env.TIDB_CA_CERT;
} else {
  // Local development
  const caPath = path.join(
    __dirname,
    "../certs/tidb-ca.pem"
  );

  caCertificate = fs.readFileSync(
    caPath,
    "utf8"
  );
}

// =====================================================
// DATABASE CONNECTION
// =====================================================

const pool = mysql.createPool({
  host: process.env.DB_HOST,

  port:
    Number(process.env.DB_PORT) || 4000,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database:
    process.env.DB_NAME || "ai_travel_planner",

  ssl: {
    ca: caCertificate,
    rejectUnauthorized: true,
  },

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,
});

export default pool;