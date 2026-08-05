import express from "express";

import {
  createCompany,
  getMyCompany,
  updateCompany,
  getAllCompanies,
  getCompanyById,
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Recruiter
router.post("/", protect, recruiterOnly, createCompany);

router.get("/my", protect, recruiterOnly, getMyCompany);

router.put("/", protect, recruiterOnly, updateCompany);

// Public
router.get("/", getAllCompanies);

router.get("/:id", getCompanyById);

export default router;