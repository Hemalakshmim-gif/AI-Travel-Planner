import express from "express";
import { testAI } from "../controllers/testAIController.js";

const router = express.Router();

router.get("/ai", testAI);

export default router;