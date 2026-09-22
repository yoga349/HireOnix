import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Loader2,
  User,
  BriefcaseBusiness,
  Mail,
  CalendarDays,
  X,
} from "lucide-react";

import api from "../../services/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/applications");

      setApplications(response.data.applications || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const candidate = application.candidate;
    const job = application.job;

    const value = search.toLowerCase().trim();

    const matchesSearch =
      candidate?.name?.toLowerCase().includes(value) ||
      candidate?.email?.toLowerCase().includes(value) ||
      job?.title?.toLowerCase().includes(value) ||
      job?.company?.toLowerCase().includes(value);

    const matchesStatus =
      status === "all" ||
      application.status?.toLowerCase() === status;

    return matchesSearch && matchesStatus;
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
            Applications
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor applications across the Hireonix platform.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#087443]/10 text-[#087443]">
          <FileText size={18} />

          <span className="text-sm font-semibold">
            {applications.length} Applications
          </span>
        </div>
      </div>

      {/* Error */}
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

      {/* Filters */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              strokeWidth={2}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, job or company..."
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

          {/* Status */}
          <div className="relative md:w-52">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                w-full
                h-12
                px-4
                rounded-xl
                bg-white
                border
                border-gray-300
                text-sm
                text-gray-700
                shadow-sm
                outline-none
                appearance-none
                cursor-pointer
                transition-all
                duration-200
                hover:border-gray-400
                focus:border-[#087443]
                focus:ring-2
                focus:ring-[#087443]/10
              "
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredApplications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {applications.length}
            </span>{" "}
            applications
          </p>
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
      ) : filteredApplications.length === 0 ? (
        /* Empty State */
        <section className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <FileText
              size={28}
              className="text-[#087443]"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            No applications found
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Try changing your search or status filter.
          </p>

          {(search || status !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatus("all");
              }}
              className="
                mt-5
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                text-[#087443]
                bg-[#087443]/10
                hover:bg-[#087443]/15
                transition
              "
            >
              Clear filters
            </button>
          )}
        </section>
      ) : (
        /* Applications */
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div
            className="
              hidden
              lg:grid
              grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr]
              gap-4
              px-6
              py-4
              bg-gray-50
              border-b
              border-gray-100
              text-xs
              font-semibold
              text-gray-500
              uppercase
              tracking-wide
            "
          >
            <span>Candidate</span>
            <span>Job</span>
            <span>Company</span>
            <span>Status</span>
            <span>Applied</span>
          </div>

          {/* Application Rows */}
          <div className="divide-y divide-gray-100">
            {filteredApplications.map((application) => {
              const candidate = application.candidate;
              const job = application.job;

              return (
                <div
                  key={application._id}
                  className="
                    px-6
                    py-5
                    grid
                    grid-cols-1
                    lg:grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr]
                    gap-4
                    lg:items-center
                    hover:bg-gray-50/70
                    transition-colors
                  "
                >
                  {/* Candidate */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#087443]/10 flex items-center justify-center overflow-hidden shrink-0 border border-[#087443]/10">
                      {candidate?.profilePhoto ? (
                        <img
                          src={candidate.profilePhoto}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          size={18}
                          className="text-[#087443]"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {candidate?.name || "Candidate"}
                      </p>

                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 lg:hidden truncate">
                        <Mail size={11} className="shrink-0" />

                        {candidate?.email || "—"}
                      </p>

                      <p className="hidden lg:block text-xs text-gray-400 mt-1 truncate">
                        {candidate?.email || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Job */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <BriefcaseBusiness
                        size={15}
                        className="text-gray-500"
                      />
                    </div>

                    <span className="text-sm text-gray-600 truncate">
                      {job?.title || "—"}
                    </span>
                  </div>

                  {/* Company */}
                  <p className="text-sm text-gray-600 truncate">
                    {job?.company || "—"}
                  </p>

                  {/* Status */}
                  <StatusBadge status={application.status} />

                  {/* Applied */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarDays
                      size={14}
                      className="text-gray-400"
                    />

                    {application.createdAt
                      ? new Date(
                          application.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || "applied";

  const styles = {
    applied: "bg-blue-50 text-blue-600 border border-blue-100",
    shortlisted:
      "bg-purple-50 text-purple-600 border border-purple-100",
    interview:
      "bg-amber-50 text-amber-600 border border-amber-100",
    selected:
      "bg-emerald-50 text-emerald-600 border border-emerald-100",
    rejected:
      "bg-red-50 text-red-600 border border-red-100",
  };

  return (
    <span
      className={`
        w-fit
        px-3
        py-1.5
        rounded-full
        text-xs
        font-semibold
        whitespace-nowrap
        ${styles[normalized] || "bg-gray-100 text-gray-500 border border-gray-200"}
      `}
    >
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
};

export default Applications;