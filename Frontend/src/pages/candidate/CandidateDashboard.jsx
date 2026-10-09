import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Bookmark,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const CandidateDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [applications, setApplications] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const [
        applicationResponse,
        jobsResponse,
        savedJobsResponse,
      ] = await Promise.allSettled([
        api.get("/api/applications/my"),
        api.get("/api/jobs", {
          params: {
            page: 1,
            limit: 1,
          },
        }),
        api.get("/api/saved-jobs"),
      ]);

      if (applicationResponse.status === "fulfilled") {
        setApplications(
          applicationResponse.value.data.applications || []
        );
      } else {
        console.error(
          "Applications error:",
          applicationResponse.reason
        );
      }

      if (jobsResponse.status === "fulfilled") {
        setTotalJobs(jobsResponse.value.data.totalJobs || 0);
      } else {
        console.error("Jobs count error:", jobsResponse.reason);
      }

      if (savedJobsResponse.status === "fulfilled") {
        setSavedJobs(
          savedJobsResponse.value.data.savedJobs || []
        );
      } else {
        console.error(
          "Saved jobs error:",
          savedJobsResponse.reason
        );
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const appliedCount = applications.length;
  const savedJobsCount = savedJobs.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-[#087443]/20 border-t-[#087443] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#063b2a] p-8 text-white">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-400/10" />

        <div className="absolute -bottom-32 right-32 w-72 h-72 rounded-full bg-emerald-300/10" />

        <div className="relative">
          <p className="text-emerald-200 text-sm font-medium mb-2">
            Candidate Dashboard
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p className="mt-3 text-emerald-50/70 max-w-xl">
            Keep building your profile, discover relevant opportunities, and
            move closer to your next career opportunity.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/candidate/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#063b2a] rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
            >
              Find Jobs
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/candidate/applications"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/10 rounded-lg font-semibold text-sm hover:bg-white/15 transition"
            >
              <FileText size={16} />
              My Applications
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BriefcaseBusiness}
          title="Jobs Available"
          value={totalJobs}
          description="Total active jobs"
        />

        <StatCard
          icon={FileText}
          title="Applications"
          value={appliedCount}
          description="Total applications"
        />

        <StatCard
          icon={Bookmark}
          title="Saved Jobs"
          value={savedJobsCount}
          description="Saved opportunities"
        />

        <StatCard
          icon={BriefcaseBusiness}
          title="Profile"
          value="Active"
          description="Keep your profile updated"
        />
      </section>

      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Applications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Track your latest job applications
            </p>
          </div>

          <Link
            to="/candidate/applications"
            className="text-sm font-semibold text-[#087443] flex items-center gap-1"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-10 text-center">
            <FileText size={35} className="mx-auto text-gray-300" />

            <p className="font-medium text-gray-700 mt-4">
              No applications yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Start applying to jobs that match your skills.
            </p>

            <Link
              to="/candidate/jobs"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#087443] text-white rounded-lg text-sm font-semibold"
            >
              Explore Jobs
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.slice(0, 5).map((application) => (
              <div
                key={application._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <BriefcaseBusiness
                      size={19}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {application.job?.title || "Job"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {application.job?.company || "Company"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {application.createdAt
                      ? new Date(
                          application.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </span>

                  <StatusBadge status={application.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, description }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {description}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#087443]/10 flex items-center justify-center">
          <Icon size={19} className="text-[#087443]" />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  const styles = {
    applied: "bg-blue-50 text-blue-600",
    shortlisted: "bg-purple-50 text-purple-600",
    interview: "bg-amber-50 text-amber-600",
    selected: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
        styles[normalizedStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {normalizedStatus === "selected" && <CheckCircle2 size={13} />}
      {status || "Applied"}
    </span>
  );
};

export default CandidateDashboard;