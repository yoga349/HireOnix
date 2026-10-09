import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock,
  Building2,
  SlidersHorizontal,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [experience, setExperience] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      if (keyword.trim()) {
        params.keyword = keyword.trim();
      }

      if (location.trim()) {
        params.location = location.trim();
      }

      if (company.trim()) {
        params.company = company.trim();
      }

      if (jobType) {
        params.jobType = jobType;
      }

      if (workMode) {
        params.workMode = workMode;
      }

      if (experience) {
        params.experience = experience;
      }

      const response = await api.get("/api/jobs", {
        params,
      });

      setJobs(response.data.jobs || []);
      setTotalJobs(response.data.totalJobs || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, keyword, location, company, jobType, workMode, experience]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setCompany("");
    setJobType("");
    setWorkMode("");
    setExperience("");
    setPage(1);
  };

  const hasFilters =
    keyword || location || company || jobType || workMode || experience;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#087443]">Opportunities</p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          Find your next job
        </h1>

        <p className="text-gray-500 mt-2">
          Discover opportunities that match your skills and career goals.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-gray-200 p-4"
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, skills or company"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
            />
          </div>

          <div className="relative lg:w-64">
            <MapPin
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
            />
          </div>

          <button
            type="submit"
            className="h-12 px-7 rounded-xl bg-[#087443] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#065d35] transition"
          >
            <Search size={18} />
            Search
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#087443]"
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
            <FilterSelect
              label="Job Type"
              value={jobType}
              onChange={setJobType}
              options={["Full-time", "Part-time", "Internship", "Contract"]}
            />

            <FilterSelect
              label="Work Mode"
              value={workMode}
              onChange={setWorkMode}
              options={["Remote", "On-site", "Hybrid"]}
            />

            <FilterSelect
              label="Experience"
              value={experience}
              onChange={setExperience}
              options={["0", "1", "2", "3", "5"]}
            />

            <div>
              <label className="text-xs font-medium text-gray-500">
                Company
              </label>

              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:border-[#087443]"
              />
            </div>
          </div>
        )}
      </form>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{totalJobs} jobs found</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <BriefcaseBusiness size={16} />
          Page {page} of {totalPages}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={34} className="animate-spin text-[#087443]" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-gray-100 flex items-center justify-center">
            <BriefcaseBusiness size={25} className="text-gray-400" />
          </div>

          <h2 className="font-bold text-gray-800 mt-4">No jobs found</h2>

          <p className="text-sm text-gray-400 mt-1">
            Try changing your search or filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:border-[#087443] hover:text-[#087443]"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-4 text-sm font-medium text-gray-600">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:border-[#087443] hover:text-[#087443]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-[#087443]"
      >
        <option value="">All</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#087443]/30 hover:shadow-sm transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
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

            <p className="text-sm text-gray-500 mt-1">{job.company}</p>

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

        <div className="flex items-center gap-3 lg:shrink-0">
          <button
            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#087443] hover:border-[#087443]"
            title="Save job"
          >
            <Bookmark size={18} />
          </button>

          <Link
            to={`/candidate/jobs/${job._id}`}
            className="px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35] transition"
          >
            View Job
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
