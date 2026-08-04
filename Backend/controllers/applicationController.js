import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";



export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
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
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
    });
    
    await Notification.create({
      user: job.recruiter,
      title: "New Job Application",
      message: `${req.user.name} applied for ${job.title}`,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



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
      message: error.message,
    });
  }
};



export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({
      job: jobId,
    }).populate("candidate", "-password");

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = status;

    await application.save();

    await Notification.create({
    user: application.candidate,
    title: "Application Status Updated",
    message: `Your application status has been updated to "${status}".`,
});

    return res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};