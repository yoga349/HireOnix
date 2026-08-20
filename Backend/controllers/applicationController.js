import Application from "../Models/Application.js";
import Job from "../Models/Job.js";
import Notification from "../Models/Notification.js";
import User from "../Models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { applicationMail } from "../templates/applicationMail.js";
import { statusMail } from "../templates/statusMail.js";

//Candidate Apply for Job

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check job exists
    const job = await Job.findById(jobId);

    // Check if job is expired
    if (job.deadline && new Date(job.deadline) < new Date()) {
      job.status = "expired";
      await job.save();

      return res.status(400).json({
        success: false,
        message: "This job has expired and is no longer accepting applications",
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check already applied
    const existingApplication = await Application.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
    });

    // Notify recruiter
    await Notification.create({
      user: job.recruiter,
      title: "New Job Application",
      message: `${req.user.name} has applied for your job "${job.title}".`,
    });

    // Send email to recruiter
    const recruiter = await User.findById(job.recruiter);

    if (recruiter) {
      await sendEmail(
        recruiter.email,
        "New Job Application",
        applicationMail(req.user.name, job.title),
      );
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Candidate Applied Jobs

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Recruiter View Applicants

export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only owner recruiter can view applicants
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view applicants for your own jobs",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("candidate", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get applicants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get applicants",
    });
  }
};

// Recruiter Update Status

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find application
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Find related job
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure recruiter owns the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only manage applications for your own jobs",
      });
    }

    // Update application status
    application.status = status;

    await application.save();

    // Create notification
    try {
      await Notification.create({
        user: application.candidate,
        title: "Application Status Updated",
        message: `Your application status has been updated to "${status}".`,
      });
    } catch (notificationError) {
      console.error("Notification error:", notificationError.message);
    }

    // Find candidate
    const candidate = await User.findById(application.candidate);

    // Send email
    if (candidate?.email) {
      try {
        await sendEmail(
          candidate.email,
          "Application Status Updated",
          statusMail(job.title, status),
        );
      } catch (emailError) {
        console.error("Email error:", emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};
