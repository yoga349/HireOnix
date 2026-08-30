import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  IndianRupee,
  CalendarDays,
  FileText,
  Plus,
  Loader2,
  CheckCircle2,
  Users,
  ListChecks,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "Full-Time",
    workMode: "Remote",
    skills: "",
    vacancies: 1,
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleBlur = (e) => {
    setTouched((previous) => ({
      ...previous,
      [e.target.name]: true,
    }));
  };

  const getFieldError = (name) => {
    if (!touched[name]) return "";

    const value = formData[name];

    if (name === "title") {
      if (!value.trim()) return "Job title is required.";
      if (value.trim().length < 2)
        return "Job title must contain at least 2 characters.";
      if (value.trim().length > 100)
        return "Job title cannot exceed 100 characters.";
    }

    if (name === "description") {
      if (!value.trim()) return "Job description is required.";
      if (value.trim().length < 20)
        return "Description must contain at least 20 characters.";
    }

    if (name === "company") {
      if (!value.trim()) return "Company name is required.";
      if (value.trim().length < 2)
        return "Company name must contain at least 2 characters.";
      if (value.trim().length > 100)
        return "Company name cannot exceed 100 characters.";
    }

    if (name === "location") {
      if (!value.trim()) return "Location is required.";
      if (value.trim().length < 2)
        return "Location must contain at least 2 characters.";
      if (value.trim().length > 100)
        return "Location cannot exceed 100 characters.";
    }

    if (name === "salary") {
      if (value === "") return "Salary is required.";
      if (Number(value) < 0) return "Salary cannot be negative.";
    }

    if (name === "experience") {
      if (!value.trim()) return "Enter the required experience.";
    }

    if (name === "skills") {
      const skills = value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (skills.length === 0) return "Enter at least one required skill.";
    }

    if (name === "vacancies") {
      if (!value) return "Number of vacancies is required.";

      if (Number(value) < 1) return "Vacancies must be at least 1.";

      if (!Number.isInteger(Number(value)))
        return "Vacancies must be a whole number.";
    }

    if (name === "deadline") {
      if (!value) return "Application deadline is required.";

      const selectedDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) return "Deadline must be a future date.";
    }

    return "";
  };

  const validateForm = () => {
    const fields = [
      "title",
      "description",
      "company",
      "location",
      "salary",
      "experience",
      "skills",
      "vacancies",
      "deadline",
    ];

    const newTouched = {};

    fields.forEach((field) => {
      newTouched[field] = true;
    });

    setTouched(newTouched);

    for (const field of fields) {
      const fieldError = getFieldError(field);

      if (fieldError) {
        setError(fieldError);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
        experience: formData.experience.trim(),
        jobType: formData.jobType,
        workMode: formData.workMode,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        vacancies: Number(formData.vacancies),
        deadline: formData.deadline,
      };

      const response = await api.post("/api/jobs", payload);

      if (response.data?.success) {
        setMessage("Job posted successfully!");

        setTimeout(() => {
          navigate("/recruiter/jobs");
        }, 800);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create job. Please check the information and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[#087443] text-sm font-semibold">
          <Sparkles size={16} />
          Recruiter
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Post a New Job
        </h1>

        <p className="text-gray-500 mt-2 max-w-2xl">
          Provide clear information about the position so candidates can
          understand the opportunity.
        </p>
      </div>

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={BriefcaseBusiness}
            title="Basic Information"
            description="Enter the basic information about the job."
          />

          <div className="p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={BriefcaseBusiness}
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Backend Developer Intern"
              helper="Use a clear job title that describes the position."
              error={getFieldError("title")}
              required
            />

            <InputField
              icon={Building2}
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. TechNova Solutions"
              helper="Enter the company offering this position."
              error={getFieldError("company")}
              required
            />

            <InputField
              icon={MapPin}
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Bengaluru"
              helper="Enter the city or location of the job."
              error={getFieldError("location")}
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
              onBlur={handleBlur}
              placeholder="e.g. 30000"
              helper="Enter the salary amount as a number."
              error={getFieldError("salary")}
              required
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={CalendarDays}
            title="Job Details"
            description="Specify the type of employment and hiring requirements."
          />

          <div className="p-6 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SelectField
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                helper="Choose the employment type."
                options={["Full-Time", "Part-Time", "Internship"]}
              />

              <SelectField
                label="Work Mode"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                helper="Choose where the employee will work."
                options={["Remote", "Onsite", "Hybrid"]}
              />

              <InputField
                icon={BriefcaseBusiness}
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Fresher or 2 years"
                helper="Write Fresher, 1 year, 2 years, etc."
                error={getFieldError("experience")}
                required
              />

              <InputField
                icon={Users}
                label="Vacancies"
                name="vacancies"
                type="number"
                min="1"
                step="1"
                value={formData.vacancies}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 3"
                helper="Number of people you want to hire."
                error={getFieldError("vacancies")}
                required
              />
            </div>

            <div className="mt-6 max-w-xl">
              <InputField
                icon={CalendarDays}
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                onBlur={handleBlur}
                helper="Select a date after today."
                error={getFieldError("deadline")}
                required
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={FileText}
            title="Job Description"
            description="Explain the role and the skills required from candidates."
          />

          <div className="p-6 md:p-7 space-y-6">
            <TextAreaField
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={8}
              placeholder="Example: We are looking for a Backend Developer Intern who will work on REST APIs, authentication and database integration..."
              helper="Minimum 20 characters. Explain the role, responsibilities and work."
              error={getFieldError("description")}
              required
            />

            <TextAreaField
              label="Required Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="Example: Node.js, Express.js, MongoDB, JavaScript, REST API, Git"
              helper="Enter at least one skill. Separate multiple skills with commas."
              error={getFieldError("skills")}
              required
            />

            <div className="flex items-start gap-3 rounded-xl bg-[#087443]/5 border border-[#087443]/10 p-4">
              <ListChecks
                size={19}
                className="text-[#087443] mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-gray-800">Example</p>

                <p className="text-xs text-gray-500 mt-1 leading-6">
                  Node.js, Express.js, MongoDB, JavaScript, REST API, Git
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="sticky bottom-4 z-20">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Ready to publish?
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Make sure all required information is correct.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/recruiter/jobs")}
                className="flex-1 sm:flex-none px-6 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-7 h-11 rounded-xl bg-[#087443] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#065d35] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Post Job
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
      <Icon size={21} className="text-[#087443]" />
    </div>

    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>

      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const InputField = ({
  icon: Icon,
  label,
  helper,
  error,
  required,
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}

      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <div className="relative">
      <Icon
        size={18}
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
          error ? "text-red-400" : "text-gray-400"
        }`}
      />

      <input
        {...props}
        required={required}
        className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-gray-200 focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10"
        }`}
      />
    </div>

    {error ? (
      <p className="text-xs text-red-500 mt-1.5">{error}</p>
    ) : (
      helper && <p className="text-xs text-gray-400 mt-1.5">{helper}</p>
    )}
  </div>
);

const SelectField = ({ label, options, helper, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>

    <select
      {...props}
      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 cursor-pointer"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    {helper && <p className="text-xs text-gray-400 mt-1.5">{helper}</p>}
  </div>
);

const TextAreaField = ({ label, helper, error, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}

      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <textarea
      {...props}
      required={required}
      className={`w-full rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 p-4 outline-none resize-none transition leading-6 ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
          : "border-gray-200 focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10"
      }`}
    />

    {error ? (
      <p className="text-xs text-red-500 mt-1.5">{error}</p>
    ) : (
      helper && <p className="text-xs text-gray-400 mt-1.5">{helper}</p>
    )}
  </div>
);

export default CreateJob;
