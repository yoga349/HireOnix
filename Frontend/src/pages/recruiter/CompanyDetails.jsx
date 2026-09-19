import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  CalendarDays,
  FileText,
  Loader2,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const CompanyDetails = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/company/my");

      setCompany(response.data?.company || null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load company information",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2
          size={35}
          className="animate-spin text-[#087443]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">
          {error}
        </div>

        <button
          type="button"
          onClick={() => navigate("/recruiter/company")}
          className="mt-5 px-5 h-11 rounded-xl bg-[#087443] text-white font-semibold text-sm hover:bg-[#065d35]"
        >
          Go to Company Profile
        </button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
          <Building2
            size={28}
            className="text-[#087443]"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-5">
          Company Profile Not Found
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Create your company profile to display your company
          information here.
        </p>

        <button
          type="button"
          onClick={() => navigate("/recruiter/company")}
          className="mt-6 px-5 h-11 rounded-xl bg-[#087443] text-white font-semibold text-sm hover:bg-[#065d35]"
        >
          Create Company Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#087443]">
            Recruiter
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
            Company Details
          </h1>

          <p className="text-gray-500 mt-2">
            View your company profile and information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/recruiter/company")}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#087443] text-white font-semibold text-sm hover:bg-[#065d35] transition"
        >
          <Edit size={17} />
          Edit Profile
        </button>
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#087443]/10 flex items-center justify-center shrink-0">
            <Building2
              size={36}
              className="text-[#087443]"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {company.companyName || "Company"}
              </h2>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <p className="text-gray-500 mt-1">
              {company.industry || "Industry not specified"}
            </p>

            {company.headquarters && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-2">
                <MapPin size={15} />
                {company.headquarters}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={Building2}
          title="Company Information"
          description="Basic information about your organization."
        />

        <div className="p-6 md:p-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <InfoCard
            icon={Mail}
            label="Email"
            value={company.email}
          />

          <InfoCard
            icon={Phone}
            label="Phone"
            value={company.phone}
          />

          <InfoCard
            icon={Globe}
            label="Website"
            value={company.website}
            isLink
          />

          <InfoCard
            icon={Building2}
            label="Industry"
            value={company.industry}
          />

          <InfoCard
            icon={Users}
            label="Company Size"
            value={
              company.companySize
                ? `${company.companySize} employees`
                : ""
            }
          />

          <InfoCard
            icon={CalendarDays}
            label="Founded Year"
            value={company.foundedYear}
          />

          <InfoCard
            icon={MapPin}
            label="Headquarters"
            value={company.headquarters}
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={FileText}
          title="About the Company"
          description="Company description and overview."
        />

        <div className="p-6 md:p-7">
          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {company.description ||
              "No company description has been added yet."}
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          icon={Globe}
          title="Social Links"
          description="Your company's social media profiles."
        />

        <div className="p-6 md:p-7">
          <div className="flex flex-wrap gap-3">
            {company.socialLinks?.linkedin && (
              <a
                href={company.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#087443] hover:text-[#087443] transition"
              >
                <Globe size={17} />
                LinkedIn
              </a>
            )}

            {company.socialLinks?.twitter && (
              <a
                href={company.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#087443] hover:text-[#087443] transition"
              >
                <Globe size={17} />
                Twitter
              </a>
            )}

            {!company.socialLinks?.linkedin &&
              !company.socialLinks?.twitter && (
                <p className="text-sm text-gray-400">
                  No social links added.
                </p>
              )}
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="px-6 md:px-7 py-5 border-b border-gray-100 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
        <Icon
          size={21}
          className="text-[#087443]"
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
  isLink = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
          <Icon
            size={18}
            className="text-[#087443]"
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {label}
          </p>

          {isLink && value ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="block text-sm font-semibold text-[#087443] hover:underline mt-1 break-all"
            >
              {value}
            </a>
          ) : (
            <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
              {value || "Not specified"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;