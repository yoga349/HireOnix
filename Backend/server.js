import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recruiterDashboardRoutes from "./routes/recruiterDashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import multer from "multer";
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recruiter-dashboard", recruiterDashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size cannot exceed 5 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});