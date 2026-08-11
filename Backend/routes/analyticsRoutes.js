import express from "express";

import { getRecruiterAnalytics } from "../controllers/analyticsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/recruiter",protect,recruiterOnly,getRecruiterAnalytics);

export default router;