import express from "express";

import {
  adminLogin,
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Login
router.post("/login", adminLogin);

// Admin Dashboard
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

// Jobs
router.get(
  "/jobs",
  protect,
  adminOnly,
  getAllJobs
);

router.delete(
  "/jobs/:id",
  protect,
  adminOnly,
  deleteJob
);
export default router;