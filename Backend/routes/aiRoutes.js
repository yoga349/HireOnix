import express from "express";

import {
  analyzeCandidateResume,
  getResumeAnalyses,
  getJobMatches,
  getRecommendations,
} from "../controllers/aiController.js";

import { protect } from "../middleware/authMiddleware.js";
import { candidateOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/analyze-resume", protect, candidateOnly, analyzeCandidateResume);
router.get("/resume-analysis", protect, candidateOnly, getResumeAnalyses);
router.get("/job-matches", protect, candidateOnly, getJobMatches);
router.get("/recommendations",protect,candidateOnly,getRecommendations);

export default router;
