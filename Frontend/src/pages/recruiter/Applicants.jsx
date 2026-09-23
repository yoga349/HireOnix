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
  CheckCircle2,
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

      const response = await api.get(
        `/api/applications/job/${jobId}`
      );

      setApplications(response.data.applications || []);
      setJob(response.data.job || null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdating(applicationId);
      setError("");
      setMessage("");

      const response = await api.patch(
        `/api/applications/${applicationId}/status`,
        { status }
      );

      const updatedApplication = response.data?.application;

      if (!updatedApplication) {
        throw new Error("Invalid response from server");
      }

      setApplications((previous) =>
        previous.map((application) => {
          if (application._id !== applicationId) {
            return application;
          }

          return {
            ...application,
            status: updatedApplication.status,
            candidate: application.candidate,
          };
        })
      );

      setMessage(
        `Application status changed to ${status}.`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to update application status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const filteredApplications = applications.filter(
    (application) => {
      const value = search.toLowerCase().trim();
      const candidate = application.candidate;

      if (!value) return true;

      return (
        candidate?.name?.toLowerCase().includes(value) ||
        candidate?.email?.toLowerCase().includes(value)
      );
    }
  );

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-sm font-semibold text-[#087443]">
          Recruiter
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
          Applicants
        </h1>

        <p className="text-gray-500 mt-2">
          Review candidates and manage their application status.
        </p>
      </div>

      {job && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#087443]/10 flex items-center justify-center">
              <FileText
                size={21}
                className="text-[#087443]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Job Position
              </p>

              <h2 className="font-bold text-gray-900 mt-1">
                {job.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {job.company}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants by name or email..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            size={35}
            className="animate-spin text-[#087443]"
          />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <Users
              size={28}
              className="text-[#087443]"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            {search
              ? "No applicants found"
              : "No applications yet"}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {search
              ? "Try another name or email."
              : "Candidates who apply for this job will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicantCard
              key={application._id}
              application={application}
              candidate={application.candidate}
              updating={updating}
              onStatusChange={updateStatus}
            />
          ))}
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
  const status = application.status || "Applied";
  const normalizedStatus = status.toLowerCase();
  const isUpdating = updating === application._id;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-[#087443]/30 transition">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
        <div className="flex gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full bg-[#087443]/10 flex items-center justify-center shrink-0 overflow-hidden">
            {candidate?.profilePhoto ? (
              <img
                src={candidate.profilePhoto}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Users
                size={22}
                className="text-[#087443]"
              />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900">
              {candidate?.name || "Candidate"}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
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
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <StatusBadge status={normalizedStatus} />
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            {candidate?.resume ? (
              <a
                href={candidate.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#087443] hover:text-[#087443] transition"
              >
                <FileText size={16} />
                View Resume
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-sm text-gray-400">
                No resume available
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusButton
              label="Shortlist"
              icon={UserCheck}
              status="Shortlisted"
              active={normalizedStatus === "shortlisted"}
              disabled={isUpdating}
              onClick={onStatusChange}
              applicationId={application._id}
            />

            <StatusButton
              label="Interview"
              icon={Clock}
              status="Interview"
              active={normalizedStatus === "interview"}
              disabled={isUpdating}
              onClick={onStatusChange}
              applicationId={application._id}
            />

            <StatusButton
              label="Select"
              icon={CheckCircle2}
              status="Selected"
              active={normalizedStatus === "selected"}
              disabled={isUpdating}
              onClick={onStatusChange}
              applicationId={application._id}
            />

            <StatusButton
              label="Reject"
              icon={XCircle}
              status="Rejected"
              active={normalizedStatus === "rejected"}
              disabled={isUpdating}
              onClick={onStatusChange}
              applicationId={application._id}
              danger
            />

            {isUpdating && (
              <div className="flex items-center px-2">
                <Loader2
                  size={18}
                  className="animate-spin text-[#087443]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    applied: "bg-blue-50 text-blue-600 border-blue-100",
    shortlisted:
      "bg-purple-50 text-purple-600 border-purple-100",
    interview:
      "bg-amber-50 text-amber-600 border-amber-100",
    selected:
      "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected:
      "bg-red-50 text-red-600 border-red-100",
  };

  const label =
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`self-start px-3.5 py-1.5 rounded-full text-xs font-bold border ${
        styles[status] ||
        "bg-gray-100 text-gray-500 border-gray-200"
      }`}
    >
      {label}
    </span>
  );
};

const StatusButton = ({
  label,
  icon: Icon,
  status,
  applicationId,
  onClick,
  active,
  disabled,
  danger,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick(applicationId, status)}
      disabled={disabled || active}
      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
        active
          ? danger
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-[#087443]/10 border-[#087443]/20 text-[#087443]"
          : danger
          ? "border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          : "border-gray-200 text-gray-500 hover:border-[#087443] hover:bg-[#087443]/5 hover:text-[#087443]"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
};

export default Applicants;