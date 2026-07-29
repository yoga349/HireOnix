import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    uploadResume,
    uploadProfilePhoto,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post(
    "/resume",
    protect,
    upload.single("resume"),
    uploadResume
);

router.post(
    "/profile-photo",
    protect,
    upload.single("profilePhoto"),
    uploadProfilePhoto
);

export default router;