import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/post-job",
  protect,
  recruiterOnly,
  (req, res) => {
    res.json({
      message:
        "Job posted successfully",
    });
  }
);

export default router;