import express from "express";

import {
  analyzeCandidateResume,
  getResumeAnalyses,
  getJobMatches,
  getRecommendations,
} from "../controllers/aiController.js";

import { protect } from "../middleware/authMiddleware.js";
import { candidateOnly } from "../middleware/roleMiddleware.js";
import { aiLimiter } from "../middleware/rateLimit.js";
const router = express.Router();

router.post("/analyze-resume", protect, candidateOnly,aiLimiter, analyzeCandidateResume);
router.get("/resume-analysis", protect, candidateOnly, getResumeAnalyses);
router.get("/job-matches", protect, candidateOnly,aiLimiter, getJobMatches);
router.get("/recommendations",protect,candidateOnly,aiLimiter,getRecommendations);

export default router;
