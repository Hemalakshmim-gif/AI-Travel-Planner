import express from "express";

import {
  saveTrip,
  getAllTrips,
  getSingleTrip,
  updateExistingTrip,
  regenerateTrip,
  removeTrip,
} from "../controllers/tripController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ======================================
// SAVE
// POST /api/trips
// ======================================

router.post(
  "/",
  protect,
  saveTrip
);


// ======================================
// GET ALL
// GET /api/trips
// ======================================

router.get(
  "/",
  protect,
  getAllTrips
);


// ======================================
// GET ONE
// GET /api/trips/:id
// ======================================

router.get(
  "/:id",
  protect,
  getSingleTrip
);


// ======================================
// UPDATE
// PUT /api/trips/:id
// ======================================

router.put(
  "/:id",
  protect,
  updateExistingTrip
);


// ======================================
// AI REGENERATE
// POST /api/trips/:id/regenerate
// ======================================

router.post(
  "/:id/regenerate",
  protect,
  regenerateTrip
);


// ======================================
// DELETE
// DELETE /api/trips/:id
// ======================================

router.delete(
  "/:id",
  protect,
  removeTrip
);


export default router;