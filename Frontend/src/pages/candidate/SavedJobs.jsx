import { useEffect, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/saved-jobs");

      setSavedJobs(response.data.savedJobs || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const removeSavedJob = async (jobId) => {
    try {
      setRemoving(jobId);

      await api.delete(`/api/saved-jobs/${jobId}`);

      setSavedJobs((previous) =>
        previous.filter((item) => {
          const currentJob = item.job || item;

          return currentJob._id !== jobId;
        }),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Unable to remove saved job");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-[#087443]">Your collection</p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">Saved Jobs</h1>

        <p className="text-gray-500 mt-2">
          Keep track of opportunities you want to explore later.
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
      ) : savedJobs.length === 0 ? (
        /* Empty state */

        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <Bookmark size={28} className="text-[#087443]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            No saved jobs yet
          </h2>

          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            When you find a job you like, save it here so you can come back to
            it later.
          </p>

          <Link
            to="/candidate/jobs"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35]"
          >
            Explore Jobs
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Saved jobs */

        <div className="space-y-4">
          {savedJobs.map((item) => {
            const job = item.job || item;

            return (
              <div
                key={item._id || job._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#087443]/30 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Job information */}

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
                      <Building2 size={21} className="text-[#087443]" />
                    </div>

                    <div>
                      <Link
                        to={`/candidate/jobs/${job._id}`}
                        className="text-lg font-bold text-gray-900 hover:text-[#087443]"
                      >
                        {job.title}
                      </Link>

                      <p className="text-sm text-gray-500 mt-1">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <BriefcaseBusiness size={14} />
                          {job.jobType}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {job.workMode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeSavedJob(job._id)}
                      disabled={removing === job._id}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                      title="Remove saved job"
                    >
                      {removing === job._id ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>

                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35] transition flex items-center gap-2"
                    >
                      View Job
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
