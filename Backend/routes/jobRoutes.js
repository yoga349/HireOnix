import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  updateJob,
} from "../controllers/jobControllers.js";

import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, recruiterOnly, createJob);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.put("/:id", protect, recruiterOnly, updateJob);

router.delete("/:id", protect, recruiterOnly, deleteJob);

export default router;