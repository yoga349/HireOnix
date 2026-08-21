import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
} from "lucide-react";

import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Role-based navigation
      if (data.user.role === "candidate") {
        navigate("/candidate/dashboard");
      } else if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] flex">
      {/* ================= LEFT SIDE ================= */}

      <div className="hidden lg:flex lg:w-1/2 bg-[#063b2a] text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/10" />

        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-300/10" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}

          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <BriefcaseBusiness size={24} />
            </div>

            <span className="text-2xl font-bold tracking-tight">Hireonix</span>
          </Link>

          {/* Main content */}

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mb-7">
              <Sparkles size={16} />
              AI-powered hiring platform
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight">
              Find opportunities.
              <br />
              Build your future.
            </h1>

            <p className="mt-6 text-lg text-emerald-50/75 leading-relaxed max-w-lg">
              Discover jobs that match your skills, analyze your resume with
              AI, and get personalized career recommendations.
            </p>

            {/* Features */}

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="font-semibold">AI Resume Analysis</p>

                  <p className="text-sm text-emerald-50/60">
                    Understand your resume strengths and weaknesses
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <BriefcaseBusiness size={19} />
                </div>

                <div>
                  <p className="font-semibold">Smart Job Matching</p>

                  <p className="text-sm text-emerald-50/60">
                    Find jobs that actually fit your skills
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users size={19} />
                </div>

                <div>
                  <p className="font-semibold">Connect with Employers</p>

                  <p className="text-sm text-emerald-50/60">
                    Apply and manage your career from one place
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <p className="text-sm text-emerald-50/40">
            © {new Date().getFullYear()} Hireonix. All rights reserved.
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}

          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#063b2a] text-white flex items-center justify-center">
              <BriefcaseBusiness size={21} />
            </div>

            <span className="text-2xl font-bold text-[#063b2a]">
              Hireonix
            </span>
          </div>

          {/* Heading */}

          <div className="mb-8">
            <p className="text-sm font-semibold text-[#087443] mb-2">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>

            <p className="text-gray-500 mt-2">
              Continue your journey with Hireonix.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}

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

            {/* Password */}

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
                  placeholder="Enter your password"
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
            </div>

            {/* Forgot password */}

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-[#087443] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#087443] text-white font-semibold flex items-center justify-center gap-2 transition hover:bg-[#065d35] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}

          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-gray-200 flex-1" />

            <span className="text-xs text-gray-400">OR</span>

            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Register */}

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#087443] hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* Security */}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={15} />
            Your information is securely protected
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

