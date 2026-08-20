import Company from "../Models/Company.js";

// Create Company
export const createCompany = async (req, res) => {
  try {
    const existingCompany = await Company.findOne({
      recruiter: req.user._id,
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "You already have a company profile.",
      });
    }

    const company = await Company.create({
      recruiter: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Company
export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      recruiter: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Company
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      {
        recruiter: req.user._id,
      },
      req.body,
      {
        new: true,
      },
    );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("recruiter", "name email");

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Company By Id
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "recruiter",
      "name email",
    );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
