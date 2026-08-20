import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
} from "../controllers/profileController.js";

import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrUpdateProfile);

router.get("/", protect, getMyProfile);

export default router;
