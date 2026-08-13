import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateExpiredJobs,
} from "../controllers/jobControllers.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createJobValidator } from "../validators/jobValidator.js";

import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, recruiterOnly, validate(createJobValidator), createJob);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.put("/:id", protect, recruiterOnly, updateJob);

router.delete("/:id", protect, recruiterOnly, deleteJob);

router.patch("/update-expired", protect, recruiterOnly,updateExpiredJobs);


export default router;