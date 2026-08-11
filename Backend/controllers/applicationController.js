import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
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
        message: "Access denied",
      });
    }

    const applications = await Application.find({
      job: jobId,
    }).populate("candidate", "-password");

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

// Recruiter Update Status

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Only owner recruiter can update status
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    application.status = status;

    await application.save();

    // Notify candidate
    await Notification.create({
      user: application.candidate,
      title: "Application Status Updated",
      message: `Your application for "${application.job.title}" has been updated to "${status}".`,
    });

    // Send email to candidate
    const candidate = await User.findById(application.candidate);

    if (candidate) {
      await sendEmail(
        candidate.email,
        "Application Status Updated",
        statusMail(application.job.title, status),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
