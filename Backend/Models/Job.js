import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship"],
      required: true,
    },

    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    vacancies: {
      type: Number,
      default: 1,
    },

    deadline: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;