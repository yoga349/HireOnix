import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  UserRound,
  Building2,
  Check,
} from "lucide-react";

import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "candidate") {
          navigate("/candidate/dashboard");
        } else if (data.user.role === "recruiter") {
          navigate("/recruiter/dashboard");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create your account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] flex">
      <div className="hidden lg:flex lg:w-[46%] bg-[#063b2a] text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-400/10" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-emerald-300/10" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <BriefcaseBusiness size={24} />
            </div>
            <span className="text-2xl font-bold">Hireonix</span>
          </Link>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mb-7">
              <Sparkles size={16} />
              Your career starts here
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight">
              One platform.
              <br />
              Endless possibilities.
            </h1>

            <p className="mt-6 text-lg text-emerald-50/75 leading-relaxed max-w-lg">
              Whether you're looking for your next opportunity or building your
              dream team, Hireonix brings everything together.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Check size={16} />
                </div>
                <span className="text-emerald-50/85">
                  AI-powered career tools
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Check size={16} />
                </div>
                <span className="text-emerald-50/85">
                  Smart job discovery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Check size={16} />
                </div>
                <span className="text-emerald-50/85">
                  Simple hiring management
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-emerald-50/40">
            © {new Date().getFullYear()} Hireonix
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[54%] flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#063b2a] text-white flex items-center justify-center">
              <BriefcaseBusiness size={21} />
            </div>
            <span className="text-2xl font-bold text-[#063b2a]">
              Hireonix
            </span>
          </div>

          <div className="mb-7">
            <p className="text-sm font-semibold text-[#087443] mb-2">
              Get started
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>

            <p className="text-gray-500 mt-2">
              Join Hireonix and take the next step.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("candidate")}
                className={`relative p-4 rounded-xl border text-left transition ${
                  formData.role === "candidate"
                    ? "border-[#087443] bg-[#087443]/5 ring-2 ring-[#087443]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {formData.role === "candidate" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#087443] text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}

                <UserRound
                  size={22}
                  className={
                    formData.role === "candidate"
                      ? "text-[#087443]"
                      : "text-gray-500"
                  }
                />

                <p className="font-semibold text-gray-900 mt-3">
                  Find a job
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  I'm looking for opportunities
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("recruiter")}
                className={`relative p-4 rounded-xl border text-left transition ${
                  formData.role === "recruiter"
                    ? "border-[#087443] bg-[#087443]/5 ring-2 ring-[#087443]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {formData.role === "recruiter" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#087443] text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}

                <Building2
                  size={22}
                  className={
                    formData.role === "recruiter"
                      ? "text-[#087443]"
                      : "text-gray-500"
                  }
                />

                <p className="font-semibold text-gray-900 mt-3">
                  Hire talent
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  I'm looking for candidates
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Password must be at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#087443] text-white font-semibold flex items-center justify-center gap-2 transition hover:bg-[#065d35] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#087443] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

