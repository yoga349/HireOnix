import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock,
  Edit,
  IndianRupee,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";

import api from "../../services/api";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/jobs/${id}`);

      setJob(response.data.job);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load job");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={35} className="animate-spin text-[#087443]" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-800">
          {error || "Job not found"}
        </h2>

        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-2 mt-5 text-[#087443] font-semibold"
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#087443]"
      >
        <ArrowLeft size={17} />
        Back to Jobs
      </Link>

      <section className="bg-white rounded-2xl border border-gray-200 p-7">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#087443]/10 flex items-center justify-center shrink-0">
              <BriefcaseBusiness size={28} className="text-[#087443]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>

              <p className="text-lg text-gray-500 mt-2">{job.company}</p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {job.location || "Not specified"}
                </span>

                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness size={16} />
                  {job.jobType || "Not specified"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {job.workMode || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/recruiter/jobs/${job._id}/applicants`}
              className="h-11 px-5 rounded-lg bg-[#087443] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#065d35]"
            >
              <Users size={17} />
              Applicants
            </Link>

            <Link
              to={`/recruiter/jobs/${job._id}/edit`}
              className="h-11 px-5 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold flex items-center gap-2 hover:border-[#087443] hover:text-[#087443]"
            >
              <Edit size={17} />
              Edit
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-7">
            <h2 className="text-xl font-bold text-gray-900">Job Description</h2>

            <p className="mt-4 text-gray-600 leading-7 whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </section>

          {job.requirements?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-bold text-gray-900">Requirements</h2>

              <ul className="mt-5 space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex gap-3 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#087443] mt-2.5 shrink-0" />

                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2 mt-5">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-[#087443]/10 text-[#087443] text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900">Job Overview</h2>

            <div className="mt-5 space-y-5">
              <OverviewItem
                icon={IndianRupee}
                label="Salary"
                value={job.salary}
              />

              <OverviewItem
                icon={BriefcaseBusiness}
                label="Experience"
                value={
                  job.experience !== undefined
                    ? `${job.experience} years`
                    : null
                }
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
                icon={CalendarDays}
                label="Deadline"
                value={
                  job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : null
                }
              />
            </div>
          </section>

          <section className="mt-5 bg-[#063b2a] rounded-2xl p-6 text-white">
            <p className="text-emerald-200 text-sm">Hiring Pipeline</p>

            <h3 className="text-xl font-bold mt-1">Find your next candidate</h3>

            <p className="text-sm text-emerald-50/70 mt-2 leading-6">
              Review applicants and move candidates through your hiring process.
            </p>

            <Link
              to={`/recruiter/jobs/${job._id}/applicants`}
              className="mt-5 h-11 w-full rounded-lg bg-white text-[#063b2a] font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Users size={17} />
              View Applicants
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
};

const OverviewItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Icon size={17} className="text-gray-500" />
      </div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>

        <p className="text-sm font-medium text-gray-800 mt-1">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;
