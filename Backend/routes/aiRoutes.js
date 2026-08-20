import express from "express";

import {
  analyzeCandidateResume,
  getResumeAnalyses,
  getJobMatches,
  getRecommendations,
} from "../controllers/aiController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { candidateOnly } from "../Middleware/roleMiddleware.js";
import { aiLimiter } from "../Middleware/rateLimit.js";
const router = express.Router();

router.post(
  "/analyze-resume",
  protect,
  candidateOnly,
  aiLimiter,
  analyzeCandidateResume,
);
router.get("/resume-analysis", protect, candidateOnly, getResumeAnalyses);
router.get("/job-matches", protect, candidateOnly, aiLimiter, getJobMatches);
router.get(
  "/recommendations",
  protect,
  candidateOnly,
  aiLimiter,
  getRecommendations,
);

export default router;
