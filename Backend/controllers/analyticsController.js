import Job from "../Models/Job.js";
import Application from "../Models/Application.js";

export const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Get recruiter's jobs
    const jobs = await Job.find({
      recruiter: recruiterId,
    }).select("_id status title");

    const jobIds = jobs.map((job) => job._id);

    // Total jobs
    const totalJobs = jobs.length;

    // Job statistics
    const activeJobs = jobs.filter((job) => job.status === "active").length;

    const expiredJobs = jobs.filter((job) => job.status === "expired").length;

    const closedJobs = jobs.filter((job) => job.status === "closed").length;

    // Total applications
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Application status statistics
    const applied = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Applied",
    });

    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Shortlisted",
    });

    const interview = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Interview",
    });

    const selected = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Selected",
    });

    const rejected = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Rejected",
    });

    return res.status(200).json({
      success: true,

      analytics: {
        jobs: {
          total: totalJobs,
          active: activeJobs,
          expired: expiredJobs,
          closed: closedJobs,
        },

        applications: {
          total: totalApplications,
          applied,
          shortlisted,
          interview,
          selected,
          rejected,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
