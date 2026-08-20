import Application from "../Models/Application.js";
import SavedJob from "../Models/SavedJob.js";

export const candidateDashboard = async (req, res) => {
  try {
    const candidate = req.user._id;

    const totalApplications = await Application.countDocuments({
      candidate,
    });

    const totalSavedJobs = await SavedJob.countDocuments({
      candidate,
    });

    const interviews = await Application.countDocuments({
      candidate,
      status: "Interview",
    });

    const selected = await Application.countDocuments({
      candidate,
      status: "Selected",
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        totalSavedJobs,
        interviews,
        selected,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const recentApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate("job")
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
