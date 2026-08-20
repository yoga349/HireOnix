import express from "express";
import upload from "../Middleware/upload.js";

import {
  uploadResume,
  uploadProfilePhoto,
} from "../controllers/uploadController.js";

import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/resume", protect, upload.single("resume"), uploadResume);

router.post(
  "/profile-photo",
  protect,
  upload.single("profilePhoto"),
  uploadProfilePhoto,
);

export default router;
