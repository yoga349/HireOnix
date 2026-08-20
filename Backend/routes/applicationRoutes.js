import express from "express";

import {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { validate } from "../Middleware/validationMiddleware.js";
import { updateApplicationStatusValidator } from "../validators/applicationValidator.js";
import { protect } from "../Middleware/authMiddleware.js";
import { recruiterOnly } from "../Middleware/roleMiddleware.js";

const router = express.Router();

// Candidate
router.post("/:jobId", protect, applyJob);

router.get("/my", protect, getMyApplications);

// Recruiter
router.get("/job/:jobId", protect, recruiterOnly, getApplicants);

router.patch(
  "/:id/status",
  protect,
  recruiterOnly,
  validate(updateApplicationStatusValidator),
  updateApplicationStatus,
);
export default router;
