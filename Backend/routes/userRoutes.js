import express from "express";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user,
  });
});

export default router;
