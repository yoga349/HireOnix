import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  FileText,
  Code2,
  Globe,
  Link2,
} from "lucide-react";

import api from "../../services/api";

const RecProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/profile");

      const data = response.data || {};
      const profile = data.profile || {};
      const user = profile.user || {};

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        portfolio: profile.portfolio || "",
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setFormData((previous) => ({
          ...previous,
          name: "",
          email: "",
        }));
        setError("");
      } else {
        setError(
          error.response?.data?.message || "Unable to load profile"
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

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        portfolio: formData.portfolio.trim(),
      };

      await api.post("/api/profile", payload);

      setMessage("Profile updated successfully.");
      await fetchProfile();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#087443]/10 flex items-center justify-center">
            <Loader2
              size={24}
              className="animate-spin text-[#087443]"
            />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#087443]/10 text-[#087443] text-xs font-bold uppercase tracking-wide">
            <User size={14} />
            Recruiter Profile
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
            Manage the information candidates see about you.
          </p>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-3 bg-white border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <p className="text-sm font-semibold">Success</p>
              <p className="text-sm text-emerald-600">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-white border border-red-200 text-red-600 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Something went wrong</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <SectionHeader
              icon={User}
              title="Personal Information"
              description="Keep your recruiter account information up to date."
            />

            <div className="p-5 sm:p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <InputField
                icon={User}
                label="Full Name"
                name="name"
                value={formData.name}
                disabled
              />

              <InputField
                icon={Mail}
                label="Email Address"
                name="email"
                value={formData.email}
                type="email"
                disabled
              />

              <InputField
                icon={Phone}
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              <InputField
                icon={MapPin}
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Pune, Maharashtra"
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <SectionHeader
              icon={FileText}
              title="About You"
              description="Tell candidates about your professional background."
            />

            <div className="p-5 sm:p-6 md:p-7">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Professional Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={6}
                placeholder="Tell candidates about your professional background, recruiting experience and areas of expertise..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
              />

              <p className="text-xs text-gray-400 mt-2">
                Write a short professional introduction.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <SectionHeader
              icon={Code2}
              title="Skills"
              description="Add skills relevant to your professional profile."
            />

            <div className="p-5 sm:p-6 md:p-7">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Professional Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Recruitment, Talent Acquisition, HR, Communication"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
              />

              <p className="text-xs text-gray-400 mt-2">
                Separate multiple skills using commas.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <SectionHeader
              icon={Globe}
              title="Professional Links"
              description="Add links where candidates can learn more about you."
            />

            <div className="p-5 sm:p-6 md:p-7 space-y-5">
              <LinkField
                label="GitHub"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />

              <LinkField
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />

              <LinkField
                label="Portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </section>

          <div className="sticky bottom-4 z-10">
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  Keep your profile updated
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Candidates will see your latest information.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#087443] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#065d35] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="px-5 sm:px-6 md:px-7 py-5 border-b border-gray-100 flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
      <Icon size={21} className="text-[#087443]" />
    </div>

    <div className="min-w-0">
      <h2 className="text-base md:text-lg font-bold text-gray-900">
        {title}
      </h2>

      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const InputField = ({
  icon: Icon,
  label,
  disabled,
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {label}
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
        disabled={disabled}
        className={`w-full h-12 pl-11 pr-4 rounded-xl border text-sm outline-none transition-all duration-200 ${
          disabled
            ? "bg-gray-100/70 text-gray-500 border-gray-200 cursor-not-allowed"
            : "bg-gray-50/50 text-gray-900 border-gray-200 placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
        }`}
      />
    </div>
  </div>
);

const LinkField = ({
  label,
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {label}
    </label>

    <div className="relative">
      <Link2
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />

      <input
        type="url"
        {...props}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
      />
    </div>
  </div>
);

export default RecProfile;