import express from "express";

import { generateTrip } from "../controllers/plannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateTrip);

export default router;