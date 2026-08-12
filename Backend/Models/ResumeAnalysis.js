import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
    },

    skills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    strengths: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],

    summary: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);

export default ResumeAnalysis;