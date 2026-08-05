import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "500+",
      ],
      default: "1-10",
    },

    foundedYear: {
      type: Number,
    },

    headquarters: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;