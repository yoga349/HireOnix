import express from "express";

import {
    recruiterDashboard,
    recentJobs,
    recentApplications,
} from "../controllers/recruiterDashboardController.js";

import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/",
    protect,
    recruiterOnly,
    recruiterDashboard
);

router.get(
    "/recent-jobs",
    protect,
    recruiterOnly,
    recentJobs
);

router.get(
    "/recent-applications",
    protect,
    recruiterOnly,
    recentApplications
);

export default router;