import express from "express";

import {
    candidateDashboard,
    recentApplications,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";
import { candidateOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/candidate",
    protect,
    candidateOnly,
    candidateDashboard
);

router.get(
    "/recent-applications",
    protect,
    candidateOnly,
    recentApplications
);

export default router;