import pool from "../config/db.js";

// ===============================
// Find User By Email
// ===============================

export const findUserByEmail = async (email) => {

  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];

};

// ===============================
// Create User
// ===============================

export const createUser = async (
  fullName,
  email,
  password
) => {

  const [result] = await pool.execute(
    `
      INSERT INTO users
      (full_name, email, password)
      VALUES (?, ?, ?)
    `,
    [
      fullName,
      email,
      password,
    ]
  );

  return result.insertId;

};

// ===============================
// Find User By ID
// ===============================

export const findUserById = async (id) => {

  const [rows] = await pool.execute(
    `
      SELECT
        id,
        full_name,
        email,
        profile_image,
        created_at
      FROM users
      WHERE id = ?
    `,
    [id]
  );

  return rows[0];

};