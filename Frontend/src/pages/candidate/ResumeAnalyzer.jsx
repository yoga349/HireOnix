import { useEffect, useState } from "react";
import {
  Sparkles,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

const ResumeAnalyzer = () => {
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [profileResponse, analysisResponse] = await Promise.all([
        api.get("/api/profile"),
        api.get("/api/ai/resume-analysis"),
      ]);

      setProfile(profileResponse.data.profile);

      const analyses = analysisResponse.data.analyses || [];

      if (analyses.length > 0) {
        setAnalysis(analyses[0]);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load resume information",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setMessage("");
      setError("");

      let resumeUrl = profile?.resume;

      if (resume) {
        const formData = new FormData();
        formData.append("resume", resume);

        const uploadResponse = await api.post("/api/upload/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        resumeUrl =
          uploadResponse.data?.resume ||
          uploadResponse.data?.resumeUrl ||
          uploadResponse.data?.url ||
          uploadResponse.data?.profile?.resume;

        if (!resumeUrl) {
          throw new Error("Resume upload failed. No resume URL was returned.");
        }

        setProfile((previous) => ({
          ...previous,
          resume: resumeUrl,
        }));
      }

      if (!resumeUrl) {
        setError("Please upload a resume before analyzing it.");
        return;
      }

      const response = await api.post("/api/ai/analyze-resume", {
        resumeUrl,
      });

      setAnalysis(response.data.analysis);
      setMessage("Resume analyzed successfully.");
      setResume(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to analyze resume",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={35} className="animate-spin text-[#087443]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#087443] text-sm font-semibold">
          <Sparkles size={17} />
          AI Career Tools
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          AI Resume Analyzer
        </h1>

        <p className="text-gray-500 mt-2 max-w-2xl">
          Get an AI-powered evaluation of your resume, identify areas for
          improvement, and understand how to make your profile stronger.
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 text-sm">
          <CheckCircle2 size={17} />
          {message}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#087443]/10 flex items-center justify-center">
              <FileText size={22} className="text-[#087443]" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Analyze your resume</h2>

              <p className="text-sm text-gray-500 mt-1">
                Use your current resume or upload an updated version.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  setResume(e.target.files?.[0] || null);
                  setMessage("");
                  setError("");
                }}
              />

              <span className="h-11 px-5 rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:border-[#087443] hover:text-[#087443]">
                <Upload size={16} />
                {resume ? resume.name : "Upload New Resume"}
              </span>
            </label>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="h-11 px-6 rounded-lg bg-[#087443] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#065d35] disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : analysis ? (
                <>
                  <RefreshCw size={16} />
                  Analyze Again
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        {resume && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <CheckCircle2 size={20} className="text-[#087443]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                New resume selected
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {resume.name} is ready for analysis.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-400">Current resume</p>

          {profile?.resume ? (
            <div className="flex items-center gap-3 mt-2">
              <FileText size={18} className="text-red-500" />

              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-[#087443] hover:underline"
              >
                View current resume
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              No resume uploaded yet.
            </p>
          )}
        </div>
      </section>

      {!analysis ? (
        <section className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <Sparkles size={28} className="text-[#087443]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            Your AI analysis will appear here
          </h2>

          <p className="text-sm text-gray-400 max-w-md mx-auto mt-2">
            Upload your resume and start an analysis to receive your score,
            strengths, weaknesses, and improvement suggestions.
          </p>
        </section>
      ) : (
        <>
          <section className="bg-white rounded-2xl border border-gray-200 p-7">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-36 h-36 rounded-full border-[10px] border-[#087443]/10 flex items-center justify-center shrink-0">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#087443]">
                    {analysis.score}
                  </p>

                  <p className="text-xs text-gray-400">out of 100</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={19} className="text-[#087443]" />

                  <h2 className="text-xl font-bold text-gray-900">
                    Resume Score
                  </h2>
                </div>

                <p className="text-gray-500 mt-3 leading-7">
                  {analysis.summary ||
                    "Your resume has been analyzed by Hireonix AI."}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalysisCard
              title="Strengths"
              icon={CheckCircle2}
              items={analysis.strengths || []}
              type="success"
            />

            <AnalysisCard
              title="Areas to Improve"
              icon={AlertCircle}
              items={analysis.weaknesses || []}
              type="warning"
            />

            <AnalysisCard
              title="Missing Skills"
              icon={FileText}
              items={analysis.missingSkills || []}
              type="danger"
            />

            <AnalysisCard
              title="AI Suggestions"
              icon={Lightbulb}
              items={analysis.suggestions || []}
              type="info"
            />
          </div>
        </>
      )}
    </div>
  );
};

const AnalysisCard = ({ title, icon: Icon, items, type }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles[type]}`}
        >
          <Icon size={19} />
        </div>

        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 mt-5">No information available.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm text-gray-600 leading-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ResumeAnalyzer;
