import Profile from "../models/Profile.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ================= Resume Upload =================

export const uploadResume = async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "Hireonix/Resume",
      "image",
    );

    console.log("Cloudinary Result:", result);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        resume: result.secure_url,
      },
      {
        new: true,
        upsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      profile,
    });
  } catch (error) {
    console.log("========== UPLOAD RESUME ERROR ==========");
    console.log("Message:", error.message);
    console.log("HTTP Code:", error.http_code);
    console.log("Name:", error.name);
    console.log("Error:", error);
    console.log("Response:", error.response);
    console.log("==========================================");

    return res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

// ================= Profile Photo Upload =================

export const uploadProfilePhoto = async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "Hireonix/ProfilePhoto",
    );

    console.log("Cloudinary Result:", result);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        profilePhoto: result.secure_url,
      },
      {
        new: true,
        upsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profile,
    });
  } catch (error) {
    console.log("UPLOAD PHOTO ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
