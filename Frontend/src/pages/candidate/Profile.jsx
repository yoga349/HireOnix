import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  FileText,
  Upload,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Download,
} from "lucide-react";

import api from "../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    skills: [],
    education: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/profile");
      const data = response.data.profile;

      setProfile(data);

      setFormData({
        phone: data?.phone || "",
        location: data?.location || "",
        skills: data?.skills || [],
        education: data?.education || [],
      });
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      formData.skills.some((item) => item.toLowerCase() === skill.toLowerCase())
    ) {
      return;
    }

    setFormData({
      ...formData,
      skills: [...formData.skills, skill],
    });

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.post("/api/profile", formData);

      setProfile(response.data.profile);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;

    try {
      setUploadingPhoto(true);
      setMessage("");
      setError("");

      const data = new FormData();
      data.append("profilePhoto", photo);

      const response = await api.post("/api/upload/profile-photo", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((previous) => ({
        ...previous,
        profilePhoto: response.data.profilePhoto || response.data.url,
      }));

      setPhoto(null);
      setMessage("Profile photo updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to upload profile photo",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) return;

    try {
      setUploadingResume(true);
      setMessage("");
      setError("");

      const data = new FormData();
      data.append("resume", resume);

      const response = await api.post("/api/upload/resume", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((previous) => ({
        ...previous,
        resume: response.data.resume || response.data.url,
      }));

      setResume(null);
      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to upload resume");
    } finally {
      setUploadingResume(false);
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-sm font-medium text-[#087443]">Your information</p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">My Profile</h1>

        <p className="text-gray-500 mt-2">
          Keep your profile updated to get better job recommendations.
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 text-sm">
          <CheckCircle2 size={17} />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          {error}
        </div>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-7">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#087443]/10 flex items-center justify-center">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={42} className="text-[#087443]" />
              )}
            </div>

            <label
              htmlFor="profile-photo"
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#087443] text-white flex items-center justify-center cursor-pointer shadow"
            >
              <Camera size={17} />

              <input
                id="profile-photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>

            <p className="text-gray-500 mt-1">{user?.email}</p>

            <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-[#087443]/10 text-[#087443] text-xs font-semibold capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {photo && (
          <div className="mt-5 flex items-center justify-between bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-gray-600 truncate">{photo.name}</p>

            <button
              type="button"
              onClick={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="px-4 py-2 rounded-lg bg-[#087443] text-white text-sm font-semibold flex items-center gap-2"
            >
              {uploadingPhoto ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Upload size={15} />
              )}
              Upload
            </button>
          </div>
        )}
      </section>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-gray-200 p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#087443]/10 flex items-center justify-center">
            <User size={19} className="text-[#087443]" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Personal Information</h2>

            <p className="text-xs text-gray-400">
              Help employers know more about you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={user?.email || ""}
                disabled
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>

            <div className="relative mt-2">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#087443]"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Location
            </label>

            <div className="relative mt-2">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Pune, Maharashtra"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#087443]"
              />
            </div>
          </div>
        </div>

        <div className="mt-7">
          <label className="text-sm font-medium text-gray-600">Skills</label>

          <div className="flex gap-2 mt-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. React"
              className="flex-1 h-11 px-4 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#087443]"
            />

            <button
              type="button"
              onClick={addSkill}
              className="w-11 h-11 rounded-lg bg-[#087443] text-white flex items-center justify-center"
            >
              <Plus size={19} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#087443]/10 text-[#087443] text-sm font-medium"
              >
                {skill}

                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 h-11 rounded-lg bg-[#087443] text-white font-semibold flex items-center gap-2 hover:bg-[#065d35] disabled:opacity-60"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <section className="bg-white rounded-2xl border border-gray-200 p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#087443]/10 flex items-center justify-center">
            <FileText size={19} className="text-[#087443]" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Resume</h2>

            <p className="text-xs text-gray-400">
              Upload your latest resume for AI analysis and job matching.
            </p>
          </div>
        </div>

        <div className="mt-5">
          {profile?.resume ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 size={26} className="text-[#087443]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        Resume uploaded successfully
                      </p>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#087443] text-[11px] font-semibold">
                        Uploaded
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      Your resume is ready for AI analysis and job matching.
                    </p>
                  </div>
                </div>

                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-emerald-200 text-[#087443] text-sm font-semibold hover:bg-emerald-100 transition"
                >
                  <Download size={16} />
                  View Resume
                </a>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-7 text-center">
              <FileText size={32} className="mx-auto text-gray-300" />

              <p className="text-sm font-semibold text-gray-700 mt-3">
                No resume uploaded
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Upload a PDF up to 5 MB.
              </p>
            </div>
          )}

          {resume && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-red-50 flex items-center justify-center">
                  <FileText size={19} className="text-red-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {resume.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">Ready to upload</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files?.[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#087443]/10 file:text-[#087443] file:font-semibold"
            />

            {resume && (
              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={uploadingResume}
                className="px-5 py-2.5 rounded-lg bg-[#087443] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#065d35] transition disabled:opacity-60"
              >
                {uploadingResume ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}

                {uploadingResume ? "Uploading..." : "Upload Resume"}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
