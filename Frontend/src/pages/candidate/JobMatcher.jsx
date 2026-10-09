import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Loader2,
  Search,
  UserCheck,
  XCircle,
  Clock,
} from "lucide-react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

const Applicants = () => {
  const { id: jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/applications/job/${jobId}`);

      setApplications(response.data.applications || []);

      if (response.data.job) {
        setJob(response.data.job);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdating(applicationId);
      setError("");
      setMessage("");

      const response = await api.put(
        `/api/applications/${applicationId}/status`,
        { status },
      );

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? response.data.application
            : application,
        ),
      );

      setMessage(`Application marked as ${status}.`);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update application status",
      );
    } finally {
      setUpdating(null);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const candidate = application.candidate;
    const value = search.toLowerCase();

    return (
      candidate?.name?.toLowerCase().includes(value) ||
      candidate?.email?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#087443]">Recruiter</p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">Applicants</h1>

        <p className="text-gray-500 mt-2">
          Review candidates and manage their application status.
        </p>
      </div>

      {job && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#087443]/10 flex items-center justify-center">
              <FileText size={21} className="text-[#087443]" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">{job.title}</h2>

              <p className="text-sm text-gray-500 mt-1">{job.company}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#087443]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={34} className="animate-spin text-[#087443]" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <Users size={28} className="text-[#087443]" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            {search ? "No applicants found" : "No applications yet"}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {search
              ? "Try another search."
              : "Candidates who apply for this job will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const candidate = application.candidate;

            return (
              <ApplicantCard
                key={application._id}
                application={application}
                candidate={candidate}
                updating={updating}
                onStatusChange={updateStatus}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const ApplicantCard = ({
  application,
  candidate,
  updating,
  onStatusChange,
}) => {
  const status = application.status?.toLowerCase() || "applied";

  const isUpdating = updating === application._id;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-full bg-[#087443]/10 flex items-center justify-center shrink-0 overflow-hidden">
            {candidate?.profilePhoto ? (
              <img
                src={candidate.profilePhoto}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Users size={22} className="text-[#087443]" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {candidate?.name || "Candidate"}
            </h2>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              {candidate?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {candidate.email}
                </span>
              )}

              {candidate?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={14} />
                  {candidate.phone}
                </span>
              )}

              {candidate?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {candidate.location}
                </span>
              )}
            </div>

            {candidate?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            {candidate?.resume ? (
              <a
                href={candidate.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#087443] hover:text-[#087443]"
              >
                <FileText size={16} />
                View Resume
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-sm text-gray-400">No resume available</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusButton
              label="Shortlist"
              icon={UserCheck}
              active={status === "shortlisted"}
              disabled={isUpdating}
              onClick={() => onStatusChange(application._id, "shortlisted")}
            />

            <StatusButton
              label="Interview"
              icon={Clock}
              active={status === "interview"}
              disabled={isUpdating}
              onClick={() => onStatusChange(application._id, "interview")}
            />

            <StatusButton
              label="Selected"
              icon={UserCheck}
              active={status === "selected"}
              disabled={isUpdating}
              onClick={() => onStatusChange(application._id, "selected")}
            />

            <StatusButton
              label="Reject"
              icon={XCircle}
              danger
              active={status === "rejected"}
              disabled={isUpdating}
              onClick={() => onStatusChange(application._id, "rejected")}
            />

            {isUpdating && (
              <Loader2
                size={18}
                className="animate-spin text-[#087443] self-center ml-2"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    applied: "bg-blue-50 text-blue-600",
    shortlisted: "bg-purple-50 text-purple-600",
    interview: "bg-amber-50 text-amber-600",
    selected: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`self-start px-3 py-1.5 rounded-full text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Applied"}
    </span>
  );
};

const StatusButton = ({
  label,
  icon: Icon,
  onClick,
  active,
  disabled,
  danger,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
        active
          ? danger
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-[#087443]/10 border-[#087443]/20 text-[#087443]"
          : danger
            ? "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
            : "border-gray-200 text-gray-500 hover:border-[#087443] hover:text-[#087443]"
      } disabled:opacity-50`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
};

export default Applicants;
