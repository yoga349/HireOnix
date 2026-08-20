import express from "express";

import { getRecruiterAnalytics } from "../controllers/analyticsController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { recruiterOnly } from "../Middleware/roleMiddleware.js";

const router = express.Router();

router.get("/recruiter", protect, recruiterOnly, getRecruiterAnalytics);

export default router;
