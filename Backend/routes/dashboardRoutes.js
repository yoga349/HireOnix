import express from "express";

import {
  candidateDashboard,
  recentApplications,
} from "../controllers/dashboardController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { candidateOnly } from "../Middleware/roleMiddleware.js";

const router = express.Router();

router.get("/candidate", protect, candidateOnly, candidateDashboard);

router.get("/recent-applications", protect, candidateOnly, recentApplications);

export default router;
