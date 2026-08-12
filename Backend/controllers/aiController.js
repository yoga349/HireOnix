import Profile from "../models/Profile.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

import { extractResumeText } from "../services/resumeParser.js";
import { analyzeResume } from "../services/aiService.js";

export const analyzeCandidateResume = async (req, res) => {
  try {
    // Find candidate profile
    const profile = await Profile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Check resume exists
    if (!profile.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume first",
      });
    }

    // Extract text from PDF
    const resumeText = await extractResumeText(
      profile.resume
    );

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    // Analyze resume using OpenAI
    const analysis = await analyzeResume(resumeText);

    // Save analysis
    const resumeAnalysis = await ResumeAnalysis.create({
      candidate: req.user._id,
      resumeUrl: profile.resume,
      score: analysis.score,
      summary: analysis.summary,
      skills: analysis.skills,
      missingSkills: analysis.missingSkills,
      strengths: analysis.strengths,
      suggestions: analysis.suggestions,
    });

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis: resumeAnalysis,
    });

  } catch (error) {
    console.error("Resume Analyzer Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResumeAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({
      candidate: req.user._id,
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: analyses.length,
      analyses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};