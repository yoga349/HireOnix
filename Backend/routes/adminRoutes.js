import express from "express";

import {
  adminLogin,
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  deleteApplication,
  getAllCompanies,
  deleteCompany,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { loginLimiter } from "../middleware/rateLimit.js";
const router = express.Router();

// Admin Login
router.post("/login",  loginLimiter,adminLogin);

// Admin Dashboard
router.get("/dashboard",protect,adminOnly,getAdminDashboard);

router.get("/users",protect,adminOnly,getAllUsers);

router.delete("/users/:id",protect,adminOnly,deleteUser);

// Jobs
router.get("/jobs",protect,adminOnly,getAllJobs);

router.delete("/jobs/:id",protect,adminOnly,deleteJob);

// Applications
router.get("/applications",protect,adminOnly,getAllApplications);

router.delete("/applications/:id",protect,adminOnly,deleteApplication);

// Companies
router.get("/companies",protect,adminOnly,getAllCompanies);

router.delete("/companies/:id",protect,adminOnly,deleteCompany);

export default router;