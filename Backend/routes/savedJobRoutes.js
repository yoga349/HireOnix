import express from "express";
import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
} from "../controllers/savedJobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, candidateOnly, saveJob);
router.get("/", protect, candidateOnly, getSavedJobs);
router.delete("/:jobId", protect, candidateOnly, removeSavedJob);

export default router;