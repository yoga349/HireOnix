import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  Clock,
  CalendarDays,
  IndianRupee,
  Bookmark,
  CheckCircle2,
  Loader2,
  Building2,
} from "lucide-react";

import api from "../../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/jobs/${id}`);
        setJob(response.data.job);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      setError("");
      setMessage("");

      await api.post(`/api/applications/${id}`);

      setApplied(true);
      setMessage("Application submitted successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to apply for this job"
      );
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!saved) {
        await api.post(`/api/saved-jobs/${id}`);
        setSaved(true);
        setMessage("Job saved successfully.");
      } else {
        await api.delete(`/api/saved-jobs/${id}`);
        setSaved(false);
        setMessage("Job removed from saved jobs.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update saved job"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#087443]" />
          <p className="text-sm text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
            <Building2 size={28} className="text-gray-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Job not found
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            This job may have been removed or is no longer available.
          </p>

          <Link
            to="/candidate/jobs"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35] transition"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <button
        onClick={() => navigate("/candidate/jobs")}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#087443] transition mb-5"
      >
        <ArrowLeft size={17} />
        Back to jobs
      </button>

      <section className="relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div className="h-2 bg-[#087443]" />

        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-7">
            <div className="flex gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#087443]/10 flex items-center justify-center shrink-0">
                <Building2
                  size={30}
                  className="text-[#087443]"
                />
              </div>

              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-[#087443] text-xs font-semibold mb-3">
                  Job Opportunity
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>

                <p className="text-lg text-gray-500 mt-2">
                  {job.company}
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-3 mt-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#087443]" />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness
                      size={16}
                      className="text-[#087443]"
                    />
                    {job.jobType}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-[#087443]" />
                    {job.workMode}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 lg:pt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                title={saved ? "Remove from saved jobs" : "Save job"}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition ${
                  saved
                    ? "border-[#087443] bg-[#087443]/10 text-[#087443]"
                    : "border-gray-200 text-gray-500 hover:border-[#087443] hover:text-[#087443] hover:bg-[#087443]/5"
                }`}
              >
                {saving ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <Bookmark
                    size={20}
                    fill={saved ? "currentColor" : "none"}
                  />
                )}
              </button>

              <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`px-6 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  applied
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-[#087443] text-white hover:bg-[#065d35]"
                }`}
              >
                {applying ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Applying...
                  </>
                ) : applied ? (
                  <>
                    <CheckCircle2 size={17} />
                    Applied
                  </>
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {(message || error) && (
        <div
          className={`mt-5 rounded-2xl px-5 py-4 text-sm font-medium border ${
            message
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {message || error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Job Description
            </h2>

            <div className="mt-4 text-gray-600 leading-7 whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {job.requirements?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Requirements
              </h2>

              <ul className="mt-5 space-y-4">
                {job.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-gray-600 leading-6"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-[#087443] mt-1 shrink-0"
                    />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2 mt-5">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-2 rounded-xl bg-[#087443]/5 border border-[#087443]/10 text-[#087443] text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-gray-900">
              Job Overview
            </h2>

            <div className="mt-6 space-y-5">
              <OverviewItem
                icon={BriefcaseBusiness}
                label="Job Type"
                value={job.jobType}
              />

              <OverviewItem
                icon={MapPin}
                label="Location"
                value={job.location}
              />

              <OverviewItem
                icon={Clock}
                label="Work Mode"
                value={job.workMode}
              />

              <OverviewItem
                icon={IndianRupee}
                label="Salary"
                value={job.salary || "Not specified"}
              />

              <OverviewItem
                icon={BriefcaseBusiness}
                label="Experience"
                value={
                  job.experience !== undefined
                    ? `${job.experience} years`
                    : "Not specified"
                }
              />

              <OverviewItem
                icon={CalendarDays}
                label="Deadline"
                value={
                  job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "Not specified"
                }
              />
            </div>
          </section>

          <section className="bg-[#063b2a] rounded-2xl p-6 text-white shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-xl">✦</span>
            </div>

            <h3 className="text-lg font-bold mt-4">
              Think you're a good match?
            </h3>

            <p className="text-sm text-emerald-50/70 mt-2 leading-6">
              Apply now and track your application directly from your
              Hireonix dashboard.
            </p>

            <button
              onClick={handleApply}
              disabled={applying || applied}
              className={`mt-5 w-full h-11 rounded-xl font-semibold transition ${
                applied
                  ? "bg-emerald-100 text-[#063b2a]"
                  : "bg-white text-[#063b2a] hover:bg-emerald-50"
              }`}
            >
              {applied ? "Application Submitted" : "Apply Now"}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};

const OverviewItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Icon size={17} className="text-gray-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;