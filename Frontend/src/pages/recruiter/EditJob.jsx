import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Loader2,
  Save,
  ArrowLeft,
  CalendarDays,
  FileText,
  ListChecks,
  Sparkles,
  Users,
  ToggleLeft,
} from "lucide-react";

import api from "../../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    experience: "Fresher",
    jobType: "Full-time",
    workMode: "On-site",
    skills: "",
    vacancies: 1,
    deadline: "",
    isActive: true,
    requirements: "",
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/jobs/${id}`);
      const job = response.data?.job;

      if (!job) {
        setError("Job not found");
        return;
      }

      setFormData({
        title: job.title || "",
        description: job.description || "",
        company: job.company || "",
        location: job.location || "",
        salary: job.salary ?? "",
        experience:
          job.experience !== undefined && job.experience !== null
            ? String(job.experience)
            : "Fresher",
        jobType: job.jobType || "Full-time",
        workMode: job.workMode || "On-site",
        skills: Array.isArray(job.skills)
          ? job.skills.join(", ")
          : job.skills || "",
        vacancies: job.vacancies ?? 1,
        deadline: job.deadline
          ? new Date(job.deadline).toISOString().split("T")[0]
          : "",
        isActive: job.isActive !== undefined ? job.isActive : true,
        requirements: Array.isArray(job.requirements)
          ? job.requirements.join("\n")
          : job.requirements || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load job information",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary === "" ? "" : Number(formData.salary),
        experience: formData.experience,
        jobType: formData.jobType,
        workMode: formData.workMode,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        vacancies: Number(formData.vacancies),

        deadline: formData.deadline,

        isActive: formData.isActive,

        requirements: formData.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await api.put(`/api/jobs/${id}`, payload);

      if (response.data?.success) {
        setSuccess("Job updated successfully.");

        setTimeout(() => {
          navigate(`/recruiter/jobs/${id}`);
        }, 700);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Unable to update job");
    } finally {
      setSaving(false);
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
    <div className="max-w-6xl mx-auto pb-12">
      <button
        type="button"
        onClick={() => navigate(`/recruiter/jobs/${id}`)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#087443] transition mb-6"
      >
        <ArrowLeft size={17} />
        Back to Job
      </button>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[#087443] text-sm font-semibold">
          <Sparkles size={16} />
          Recruiter
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Edit Job
        </h1>

        <p className="text-gray-500 mt-2 max-w-2xl">
          Update your job posting information and keep your listing accurate for
          candidates.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={BriefcaseBusiness}
            title="Basic Information"
            description="Update the main information about this job."
          />

          <div className="p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={BriefcaseBusiness}
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />

            <InputField
              icon={Building2}
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />

            <InputField
              icon={MapPin}
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter job location"
              required
            />

            <InputField
              icon={IndianRupee}
              label="Salary"
              name="salary"
              type="number"
              min="0"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter salary"
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={Clock}
            title="Job Details"
            description="Define employment type, experience and availability."
          />

          <div className="p-6 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SelectField
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={["Full-time", "Part-time", "Internship", "Contract"]}
              />

              <SelectField
                label="Work Mode"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                options={["On-site", "Remote", "Hybrid"]}
              />

              <SelectField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                options={[
                  "Fresher",
                  "0-1 years",
                  "1-2 years",
                  "2-3 years",
                  "3-5 years",
                  "5+ years",
                ]}
              />

              <InputField
                icon={Users}
                label="Vacancies"
                name="vacancies"
                type="number"
                min="1"
                value={formData.vacancies}
                onChange={handleChange}
                placeholder="Number of vacancies"
                required
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                icon={CalendarDays}
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Status
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      isActive: !previous.isActive,
                    }))
                  }
                  className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between transition ${
                    formData.isActive
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ToggleLeft
                      size={21}
                      className={
                        formData.isActive ? "text-emerald-600" : "text-gray-400"
                      }
                    />

                    <span
                      className={`text-sm font-semibold ${
                        formData.isActive ? "text-emerald-700" : "text-gray-500"
                      }`}
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <span
                    className={`w-10 h-5 rounded-full p-0.5 transition ${
                      formData.isActive ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow transition ${
                        formData.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={FileText}
            title="Job Description"
            description="Provide candidates with a clear understanding of the role."
          />

          <div className="p-6 md:p-7 space-y-6">
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              placeholder="Describe the job role, responsibilities, team and what the candidate will work on..."
              required
            />

            <TextAreaField
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={6}
              placeholder={`Good knowledge of Node.js
Experience with REST APIs
Understanding of databases
Good communication skills`}
            />

            <TextAreaField
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              placeholder="Node.js, Express.js, MongoDB, JavaScript, Git"
            />

            <div className="flex items-start gap-3 rounded-xl bg-[#087443]/5 border border-[#087443]/10 p-4">
              <ListChecks
                size={18}
                className="text-[#087443] mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Skills and requirements
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-5">
                  Separate skills with commas. Enter each requirement on a
                  separate line.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="sticky bottom-4 z-20">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Ready to save your changes?
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your updated job information will be saved.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate(`/recruiter/jobs/${id}`)}
                className="flex-1 sm:flex-none px-6 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-7 h-11 rounded-xl bg-[#087443] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#065d35] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="px-6 md:px-7 py-5 border-b border-gray-100 flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
      <Icon size={20} className="text-[#087443]" />
    </div>

    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>

      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const InputField = ({ icon: Icon, label, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}

      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      )}

      <input
        {...props}
        required={required}
        className={`w-full h-12 ${
          Icon ? "pl-11" : "pl-4"
        } pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10`}
      />
    </div>
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>

    <select
      {...props}
      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 cursor-pointer"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}

      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <textarea
      {...props}
      required={required}
      className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 p-4 outline-none resize-none transition focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 leading-6"
    />
  </div>
);

export default EditJob;
