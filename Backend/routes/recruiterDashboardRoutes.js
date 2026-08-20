import express from "express";

import {
  recruiterDashboard,
  recentJobs,
  recentApplications,
} from "../controllers/recruiterDashboardController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { recruiterOnly } from "../Middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, recruiterOnly, recruiterDashboard);

router.get("/recent-jobs", protect, recruiterOnly, recentJobs);

router.get("/recent-applications", protect, recruiterOnly, recentApplications);

export default router;
