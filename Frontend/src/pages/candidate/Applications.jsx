import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/api/applications/my");

        setApplications(response.data.applications || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load applications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-[#087443]">Your job journey</p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          My Applications
        </h1>

        <p className="text-gray-500 mt-2">
          Track the progress of every job you've applied for.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={34} className="animate-spin text-[#087443]" />
        </div>
      ) : applications.length === 0 ? (
        /* Empty state */

        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <FileText size={28} className="text-[#087443]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            No applications yet
          </h2>

          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            Start exploring jobs and submit your first application.
          </p>

          <Link
            to="/candidate/jobs"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35]"
          >
            Find Jobs
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Applications */

        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

/* =====================================================
   APPLICATION CARD
===================================================== */

const ApplicationCard = ({ application }) => {
  const job = application.job;

  const status = application.status?.toLowerCase() || "applied";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Job information */}

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
            <Building2 size={21} className="text-[#087443]" />
          </div>

          <div>
            <Link
              to={`/candidate/jobs/${job?._id}`}
              className="text-lg font-bold text-gray-900 hover:text-[#087443]"
            >
              {job?.title || "Job"}
            </Link>

            <p className="text-sm text-gray-500 mt-1">
              {job?.company || "Company"}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <BriefcaseBusiness size={13} />
                {job?.jobType || "Job"}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={13} />
                {job?.workMode || "Work mode"}
              </span>

              <span className="flex items-center gap-1">
                <CalendarDays size={13} />
                Applied{" "}
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}

        <StatusBadge status={status} />
      </div>

      {/* Timeline */}

      <ApplicationTimeline status={status} />

      {/* View Job */}

      <div className="flex justify-end mt-5 pt-5 border-t border-gray-100">
        <Link
          to={`/candidate/jobs/${job?._id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#087443] hover:underline"
        >
          View Job
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

/* =====================================================
   STATUS BADGE
===================================================== */

const StatusBadge = ({ status }) => {
  const config = {
    applied: {
      label: "Applied",
      className: "bg-blue-50 text-blue-600",
    },

    shortlisted: {
      label: "Shortlisted",
      className: "bg-purple-50 text-purple-600",
    },

    interview: {
      label: "Interview",
      className: "bg-amber-50 text-amber-600",
    },

    selected: {
      label: "Selected",
      className: "bg-emerald-50 text-emerald-600",
    },

    rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-600",
    },
  };

  const current = config[status] || config.applied;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${current.className}`}
    >
      {status === "selected" && <CheckCircle2 size={14} />}

      {status === "rejected" && <XCircle size={14} />}

      {current.label}
    </span>
  );
};

/* =====================================================
   TIMELINE
===================================================== */

const ApplicationTimeline = ({ status }) => {
  const steps = [
    {
      key: "applied",
      label: "Applied",
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
    },
    {
      key: "interview",
      label: "Interview",
    },
    {
      key: "selected",
      label: "Selected",
    },
  ];

  const statusOrder = {
    applied: 0,
    shortlisted: 1,
    interview: 2,
    selected: 3,
    rejected: -1,
  };

  const currentIndex = statusOrder[status] ?? 0;

  if (status === "rejected") {
    return (
      <div className="mt-7 rounded-xl bg-red-50 border border-red-100 p-4">
        <div className="flex items-center gap-3 text-red-600">
          <XCircle size={20} />

          <div>
            <p className="font-semibold text-sm">Application Rejected</p>

            <p className="text-xs text-red-500/80 mt-1">
              This application is no longer active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = index <= currentIndex;

          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Circle */}

              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                    completed
                      ? "bg-[#087443] border-[#087443] text-white"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>

                <span
                  className={`text-xs mt-2 whitespace-nowrap ${
                    isCurrent ? "font-semibold text-[#087443]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}

              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-5 ${
                    index < currentIndex ? "bg-[#087443]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Applications;
