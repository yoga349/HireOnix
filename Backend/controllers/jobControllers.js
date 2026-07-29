import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      experience,
      jobType,
      workMode,
      skills,
      vacancies,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      experience,
      jobType,
      workMode,
      skills,
      vacancies,
      deadline,
      recruiter: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      company,
      jobType,
      workMode,
      experience,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search by title or company
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Company
    if (company) {
      filter.company = {
        $regex: company,
        $options: "i",
      };
    }

    // Job Type
    if (jobType) {
      filter.jobType = {
        $regex: jobType,
        $options: "i",
      };
    }

    // Work Mode
    if (workMode) {
      filter.workMode = {
        $regex: workMode,
        $options: "i",
      };
    }

    // Experience
    if (experience) {
      filter.experience = {
        $lte: Number(experience),
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filter)
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalJobs = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / Number(limit)),
      jobs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own jobs",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own jobs",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};