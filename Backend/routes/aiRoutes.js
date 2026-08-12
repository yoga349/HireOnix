import express from "express";

import { analyzeCandidateResume,getResumeAnalyses } from "../controllers/aiController.js";

import { protect } from "../middleware/authMiddleware.js";
import { candidateOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/analyze-resume",protect,candidateOnly,analyzeCandidateResume);
router.get("/resume-analysis",protect,candidateOnly,getResumeAnalyses);

export default router;