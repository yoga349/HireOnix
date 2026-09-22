import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  Trash2,
  Loader2,
  MapPin,
  X,
} from "lucide-react";

import api from "../../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/jobs");

      setJobs(response.data.jobs || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load jobs");
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
      setError("");
      setMessage("");

      await api.delete(`/api/admin/jobs/${jobId}`);

      setJobs((previous) =>
        previous.filter((job) => job._id !== jobId)
      );

      setMessage("Job deleted successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete job");
    } finally {
      setDeleting(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const value = search.toLowerCase().trim();

    return (
      job.title?.toLowerCase().includes(value) ||
      job.company?.toLowerCase().includes(value) ||
      job.location?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#087443]">
            Administration
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Jobs
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor and manage all job postings on Hireonix.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#087443]/10 text-[#087443]">
          <BriefcaseBusiness size={18} />

          <span className="text-sm font-semibold">
            {jobs.length} Jobs
          </span>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 text-sm">
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            className="hover:text-emerald-900 transition"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="hover:text-red-800 transition"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Search */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-xl">
          <Search
            size={19}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, companies or locations..."
            className="
              w-full
              h-12
              pl-12
              pr-11
              rounded-xl
              bg-white
              border
              border-gray-300
              text-sm
              text-gray-900
              placeholder:text-gray-500
              shadow-sm
              outline-none
              transition-all
              duration-200
              hover:border-gray-400
              focus:border-[#087443]
              focus:ring-2
              focus:ring-[#087443]/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                w-7
                h-7
                rounded-lg
                flex
                items-center
                justify-center
                text-gray-400
                hover:text-gray-700
                hover:bg-gray-100
                transition
              "
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            size={34}
            className="animate-spin text-[#087443]"
          />
        </div>
      ) : filteredJobs.length === 0 ? (
        /* Empty State */
        <section className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <BriefcaseBusiness
              size={28}
              className="text-[#087443]"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            No jobs found
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Try changing your search.
          </p>
        </section>
      ) : (
        /* Jobs Table */
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
            <span>Job</span>
            <span>Company</span>
            <span>Location</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* Jobs */}
          <div className="divide-y divide-gray-100">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="
                  px-6
                  py-5
                  grid
                  grid-cols-1
                  lg:grid-cols-[2fr_1.5fr_1.5fr_1fr_auto]
                  gap-4
                  lg:items-center
                "
              >
                {/* Job */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
                    <BriefcaseBusiness
                      size={19}
                      className="text-[#087443]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {job.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 lg:hidden">
                      {job.company || "—"}
                    </p>
                  </div>
                </div>

                {/* Company */}
                <p className="hidden lg:block text-sm text-gray-600">
                  {job.company || "—"}
                </p>

                {/* Location */}
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <MapPin
                    size={14}
                    className="text-gray-400 shrink-0"
                  />

                  {job.location || "Not specified"}
                </p>

                {/* Status */}
                <span
                  className={`
                    w-fit
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      job.status === "closed"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-emerald-50 text-emerald-600"
                    }
                  `}
                >
                  {job.status || "Active"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deleting === job._id}
                    className="
                      w-9
                      h-9
                      rounded-lg
                      border
                      border-gray-200
                      flex
                      items-center
                      justify-center
                      text-gray-500
                      hover:text-red-500
                      hover:border-red-200
                      hover:bg-red-50
                      transition
                      disabled:opacity-50
                    "
                    title="Delete job"
                  >
                    {deleting === job._id ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Jobs;