import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  CalendarDays,
  Link,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const emptyForm = {
  companyName: "",
  website: "",
  email: "",
  phone: "",
  industry: "",
  companySize: "",
  foundedYear: "",
  headquarters: "",
  description: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
  },
};

const Company = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [companyExists, setCompanyExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.get("/api/company/my");
      const company = response.data?.company;

      if (!company) {
        setCompanyExists(false);
        setFormData(emptyForm);
        return;
      }

      setCompanyExists(true);

      setFormData({
        companyName: company.companyName || "",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        industry: company.industry || "",
        companySize: company.companySize || "",
        foundedYear: company.foundedYear || "",
        headquarters: company.headquarters || "",
        description: company.description || "",
        socialLinks: {
          linkedin: company.socialLinks?.linkedin || "",
          twitter: company.socialLinks?.twitter || "",
        },
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setCompanyExists(false);
        setFormData(emptyForm);
      } else {
        setError(
          error.response?.data?.message || "Unable to load company information",
        );
      }
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

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      socialLinks: {
        ...previous.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...formData,
        foundedYear: formData.foundedYear
          ? Number(formData.foundedYear)
          : undefined,
      };

      let response;

      if (companyExists) {
        response = await api.put("/api/company", payload);
      } else {
        response = await api.post("/api/company", payload);
      }

      if (response.data?.success && response.data?.company) {
        setCompanyExists(true);

        navigate("/recruiter/company/my");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to save company information",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={35} className="animate-spin text-[#087443]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#087443]">Recruiter</p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
            Company Profile
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl">
            Manage your company information and control what candidates see
            about your organization.
          </p>
        </div>

        {companyExists && (
          <div className="inline-flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
            <CheckCircle2 size={17} />
            Company Profile Active
          </div>
        )}
      </div>

      {!companyExists && (
        <div className="flex items-center gap-3 bg-[#087443]/5 border border-[#087443]/15 rounded-xl px-5 py-4">
          <div className="w-9 h-9 rounded-lg bg-[#087443]/10 flex items-center justify-center">
            <Plus size={18} className="text-[#087443]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Create your company profile
            </p>

            <p className="text-xs text-gray-500 mt-0.5">
              Add your company details so candidates can learn more about your
              organization.
            </p>
          </div>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4 text-sm font-medium">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={Building2}
            title="Company Information"
            description="Basic information about your organization."
          />

          <div className="p-6 md:p-7">
            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                icon={Building2}
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                required
              />

              <InputField
                icon={Globe}
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              <InputField
                icon={Mail}
                label="Company Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="company@example.com"
              />

              <InputField
                icon={Phone}
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

              <InputField
                icon={Building2}
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Enter industry"
              />

              <SelectField
                icon={Users}
                label="Company Size"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                options={[
                  "1-10",
                  "11-50",
                  "51-200",
                  "201-500",
                  "501-1000",
                  "1000+",
                ]}
              />

              <InputField
                icon={CalendarDays}
                label="Founded Year"
                name="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={handleChange}
                placeholder="Founded year"
              />

              <InputField
                icon={MapPin}
                label="Headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={FileText}
            title="About the Company"
            description="Give candidates a clear overview of your organization."
          />

          <div className="p-6 md:p-7">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              placeholder="Tell candidates about your company, products, culture, mission and work environment..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none focus:bg-white focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 transition"
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            icon={Link}
            title="Social Links"
            description="Add your company's social media profiles."
          />

          <div className="p-6 md:p-7 grid md:grid-cols-2 gap-5">
            <InputField
              icon={Link}
              label="LinkedIn"
              name="linkedin"
              type="url"
              value={formData.socialLinks.linkedin}
              onChange={handleSocialChange}
              placeholder="https://linkedin.com/company/your-company"
            />

            <InputField
              icon={Globe}
              label="Twitter"
              name="twitter"
              type="url"
              value={formData.socialLinks.twitter}
              onChange={handleSocialChange}
              placeholder="https://twitter.com/your-company"
            />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={fetchCompany}
            disabled={saving}
            className="h-11 px-6 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="h-11 px-7 rounded-xl bg-[#087443] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#065d35] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {companyExists ? "Save Changes" : "Create Company Profile"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="px-6 md:px-7 py-5 border-b border-gray-100 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
        <Icon size={21} className="text-[#087443]" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, label, required, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          {...props}
          required={required}
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 transition"
        />
      </div>
    </div>
  );
};

const SelectField = ({ icon: Icon, label, options, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        <select
          {...props}
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none appearance-none focus:bg-white focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10 transition"
        >
          <option value="">Select company size</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option} employees
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Company;
