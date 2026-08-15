import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Selected",
      ],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;

