import SavedJob from "../Models/SavedJob.js";
import Job from "../Models/Job.js";

// Save a job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const existing = await SavedJob.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      candidate: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// View saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      candidate: req.user._id,
    })
      .populate({
        path: "job",
        populate: {
          path: "recruiter",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove saved job
export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      candidate: req.user._id,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
