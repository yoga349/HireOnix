import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    location: {
      type: String,
    },

    bio: {
      type: String,
    },

    skills: [
      {
        type: String,
      },
    ],

    education: {
      college: String,
      degree: String,
      branch: String,
      cgpa: Number,
      passingYear: Number,
    },

    github: String,

    linkedin: String,

    portfolio: String,

    resume: String,

    profilePhoto: String,
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;