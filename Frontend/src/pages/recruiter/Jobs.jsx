import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  Plus,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const RecruiterJobs = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/jobs");

      const allJobs = response.data.jobs || [];
      const recruiterId = user?._id || user?.id;

      const myJobs = allJobs.filter((job) => {
        const jobRecruiter =
          typeof job.recruiter === "object"
            ? job.recruiter?._id || job.recruiter?.id
            : job.recruiter;

        return jobRecruiter?.toString() === recruiterId?.toString();
      });

      setJobs(myJobs);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    try {
      setDeleting(jobId);

      await api.delete(`/api/jobs/${jobId}`);

      setJobs((previous) => previous.filter((job) => job._id !== jobId));
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete job");
    } finally {
      setDeleting(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const value = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(value) ||
      job.company?.toLowerCase().includes(value) ||
      job.location?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#087443]">Recruiter</p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">Manage Jobs</h1>

          <p className="text-gray-500 mt-2">
            Manage and monitor all your job postings.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-[#087443] text-white font-semibold text-sm hover:bg-[#065d35]"
        >
          <Plus size={18} />
          Post a Job
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-xl">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your jobs..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={34} className="animate-spin text-[#087443]" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <BriefcaseBusiness size={28} className="text-[#087443]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            {search ? "No matching jobs" : "No jobs posted yet"}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {search
              ? "Try a different search."
              : "Create your first job posting to start hiring."}
          </p>

          {!search && (
            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold"
            >
              <Plus size={16} />
              Post a Job
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#087443]/30 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
                    <BriefcaseBusiness size={21} className="text-[#087443]" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {job.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {job.location || "Not specified"}
                      </span>

                      <span>{job.jobType || "Full-time"}</span>

                      <span>{job.workMode || "On-site"}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`self-start lg:self-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    job.status === "closed"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {job.status || "Active"}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/recruiter/jobs/${job._id}`}
                    title="View job"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#087443] hover:border-[#087443]"
                  >
                    <Eye size={17} />
                  </Link>

                  <Link
                    to={`/recruiter/jobs/${job._id}/edit`}
                    title="Edit job"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#087443] hover:border-[#087443]"
                  >
                    <Edit size={17} />
                  </Link>

                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    title="Applicants"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#087443] hover:border-[#087443]"
                  >
                    <Users size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(job._id)}
                    disabled={deleting === job._id}
                    title="Delete job"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 disabled:opacity-50"
                  >
                    {deleting === job._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
