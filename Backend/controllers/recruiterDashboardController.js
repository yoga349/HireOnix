import Job from "../Models/Job.js";
import Application from "../Models/Application.js";

// Dashboard Statistics
export const recruiterDashboard = async (req, res) => {
  try {
    const recruiter = req.user._id;

    // Jobs posted by recruiter
    const totalJobs = await Job.countDocuments({
      recruiter,
    });

    // Active jobs
    const activeJobs = await Job.countDocuments({
      recruiter,
      isActive: true,
    });

    // Closed jobs
    const closedJobs = await Job.countDocuments({
      recruiter,
      isActive: false,
    });

    // Get recruiter's jobs
    const jobs = await Job.find({ recruiter }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Total applications
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const recentJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const recentApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("candidate", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
