import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  Plus,
  ArrowRight,
  MapPin,
  Loader2,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const RecruiterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsResponse, analyticsResponse, applicationsResponse] =
        await Promise.all([
          api.get("/api/jobs"),
          api.get("/api/analytics/recruiter"),
          api.get("/api/recruiter-dashboard/recent-applications"),
        ]);

      const allJobs = jobsResponse.data.jobs || [];
      const analytics = analyticsResponse.data.analytics;

      const recruiterId = user?._id || user?.id;

      const myJobs = allJobs.filter((job) => {
        const jobRecruiter =
          typeof job.recruiter === "object"
            ? job.recruiter?._id || job.recruiter?.id
            : job.recruiter;

        return jobRecruiter?.toString() === recruiterId?.toString();
      });

      setJobs(myJobs);

      setStats({
        totalJobs: analytics?.jobs?.total ?? myJobs.length,

        activeJobs:
          analytics?.jobs?.active ??
          myJobs.filter((job) => job.status === "active").length,

        totalApplicants: analytics?.applications?.total ?? 0,

        shortlisted: analytics?.applications?.shortlisted ?? 0,
      });

      setApplications(applicationsResponse.data.applications || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load recruiter dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#087443]" />
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-8">
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#087443]" />

            <p className="text-sm font-semibold text-[#087443]">
              Recruiter Dashboard
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Welcome back, {user?.name?.split(" ")[0] || "Recruiter"} 👋
          </h1>

          <p className="text-gray-500 mt-2 max-w-xl">
            Manage your job postings, review candidates and keep track of your
            hiring progress.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-[#087443] text-white font-semibold text-sm hover:bg-[#065d35] transition shadow-sm"
        >
          <Plus size={18} />
          Post a Job
        </Link>
      </section>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-4 text-sm font-medium">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={BriefcaseBusiness}
          description="Jobs you've posted"
        />

        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={TrendingUp}
          description="Currently accepting applications"
        />

        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon={Users}
          description="Applications received"
        />

        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={UserCheck}
          description="Candidates shortlisted"
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={18} className="text-[#087443]" />

                <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Your latest job postings
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#087443] hover:text-[#065d35]"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
                <BriefcaseBusiness size={28} className="text-[#087443]" />
              </div>

              <h3 className="font-bold text-gray-800 mt-5">
                No jobs posted yet
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Create your first job posting to start receiving applications.
              </p>

              <Link
                to="/recruiter/jobs/create"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35]"
              >
                <Plus size={16} />
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
                      <BriefcaseBusiness size={19} className="text-[#087443]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {job.location}
                          </span>
                        )}

                        {job.jobType && <span>{job.jobType}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                        job.status === "closed"
                          ? "bg-gray-100 text-gray-500"
                          : job.status === "expired"
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {job.status || "Active"}
                    </span>

                    <Link
                      to={`/recruiter/jobs/${job._id}`}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#087443] hover:text-[#087443] transition"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-[#063b2a] rounded-2xl p-6 text-white shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <TrendingUp size={21} />
          </div>

          <p className="text-emerald-200 text-sm font-semibold mt-5">
            Hiring Overview
          </p>

          <h2 className="text-2xl font-bold mt-1">Keep your hiring moving</h2>

          <p className="text-sm text-emerald-50/70 mt-2 leading-6">
            Review applications, manage your job postings and find the best
            candidates for your team.
          </p>

          <div className="mt-6 space-y-3">
            <QuickAction
              to="/recruiter/jobs/create"
              icon={Plus}
              title="Post a Job"
            />

            <QuickAction
              to="/recruiter/jobs"
              icon={Users}
              title="Manage Applicants"
            />

            <QuickAction
              to="/recruiter/analytics"
              icon={FileText}
              title="View Analytics"
            />
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#087443]" />

              <h2 className="text-lg font-bold text-gray-900">
                Recent Applicants
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Candidates who recently applied to your jobs
            </p>
          </div>

          <Link
            to="/recruiter/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#087443] hover:text-[#065d35]"
          >
            View Jobs
            <ArrowRight size={15} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gray-100 flex items-center justify-center">
              <Users size={25} className="text-gray-400" />
            </div>

            <p className="font-semibold text-gray-700 mt-4">
              No applicants yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Applicants will appear here when candidates apply to your jobs.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.slice(0, 5).map((application) => {
              const candidate = application.candidate;
              const job = application.job;

              return (
                <div
                  key={application._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#087443]/10 flex items-center justify-center shrink-0">
                      <Users size={18} className="text-[#087443]" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {candidate?.name || "Candidate"}
                      </p>

                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {candidate?.email || "No email available"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Applied for{" "}
                        <span className="font-medium text-gray-500">
                          {job?.title || "your job"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <ApplicationStatus status={application.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-[#087443]/30 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>

          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center">
          <Icon size={20} className="text-[#087443]" />
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ to, icon: Icon, title }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition"
    >
      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon size={17} />
      </div>

      <span className="text-sm font-semibold flex-1">{title}</span>

      <ArrowRight size={15} />
    </Link>
  );
};

const ApplicationStatus = ({ status }) => {
  const normalized = status?.toLowerCase() || "applied";

  const styles = {
    applied: "bg-blue-50 text-blue-600",
    shortlisted: "bg-purple-50 text-purple-600",
    interview: "bg-amber-50 text-amber-600",
    selected: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
        styles[normalized] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status || "Applied"}
    </span>
  );
};

export default RecruiterDashboard;
