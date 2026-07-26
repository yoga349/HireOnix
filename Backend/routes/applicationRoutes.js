import express from "express";

import {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Candidate
router.post("/:jobId", protect, applyJob);

router.get("/my", protect, getMyApplications);

// Recruiter
router.get("/job/:jobId", protect, recruiterOnly, getApplicants);

router.put("/:id", protect, recruiterOnly, updateApplicationStatus);

export default router;