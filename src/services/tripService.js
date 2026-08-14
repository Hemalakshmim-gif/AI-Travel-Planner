import axios from "axios";

// ======================================
// API
// ======================================

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ======================================
// AUTH TOKEN
// ======================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================
// GET ALL TRIPS
// ======================================

export const getTrips = () => {
  return API.get("/trips");
};

// ======================================
// GET SINGLE TRIP
// ======================================

export const getTripById = (id) => {
  return API.get(`/trips/${id}`);
};

// ======================================
// UPDATE TRIP
// ======================================

export const updateTrip = (id, data) => {
  return API.put(`/trips/${id}`, data);
};

// ======================================
// AI REGENERATE TRIP
// ======================================

export const regenerateTrip = (id, data) => {
  return API.post(`/trips/${id}/regenerate`, data);
};

// ======================================
// DELETE TRIP
// ======================================

export const deleteTrip = (id) => {
  return API.delete(`/trips/${id}`);
};

export default API;