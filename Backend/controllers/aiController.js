import Profile from "../models/Profile.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import Job from "../models/Job.js";
import { matchJobsWithResume } from "../services/jobMatcherService.js";
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

export const getJobMatches = async (req, res) => {
  try {
    // Get latest resume analysis
    const resumeAnalysis = await ResumeAnalysis.findOne({
      candidate: req.user._id,
    }).sort({ createdAt: -1 });

    if (!resumeAnalysis) {
      return res.status(400).json({
        success: false,
        message: "Please analyze your resume first",
      });
    }

    // Get active jobs
    const jobs = await Job.find({
      status: "active",
    })
      .select(
        "title description company location skills experience jobType workMode"
      )
      .limit(20);

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active jobs available",
      });
    }

    // Send candidate + jobs to AI
    const matchingResult = await matchJobsWithResume(
      resumeAnalysis,
      jobs
    );

    // Attach complete job information
    const matches = matchingResult.matches
      .map((match) => {
        const job = jobs.find(
          (job) => job._id.toString() === match.jobId
        );

        if (!job) return null;

        return {
          job,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          reason: match.reason,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      totalMatches: matches.length,
      matches,
    });

  } catch (error) {
    console.error("Job Matcher Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};