import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-travel-planner-backend-nkt5.onrender.com/api/auth",
});

// ==============================
// Register
// ==============================

export const registerUser = (userData) => {
  return API.post("/register", userData);
};

// ==============================
// Login
// ==============================

export const loginUser = (userData) => {
  return API.post("/login", userData);
};

// ==============================
// Get Logged In User
// ==============================

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");

  return API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};