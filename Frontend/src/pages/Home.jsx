import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Search,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  Users,
  MapPin,
  Clock3,
  Building2,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import api from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const goToRegister = () => {
    setMenuOpen(false);
    navigate("/register");
  };

  useEffect(() => {
    let active = true;

    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/jobs");
        const data = response.data.jobs || [];
        if (active) {
          setJobs(data.filter((job) => job.isActive !== false).slice(0, 6));
        }
      } catch {
        if (active) setJobs([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    goToRegister();
  };

  const features = [
    {
      icon: FileText,
      title: "AI Resume Analyzer",
      description:
        "Understand your resume's strengths and identify areas you can improve before applying.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description:
        "Discover opportunities aligned with your skills, experience and career goals.",
    },
    {
      icon: TrendingUp,
      title: "Application Tracking",
      description:
        "Keep track of your applications and follow your progress throughout the hiring process.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Build your profile",
      description:
        "Create your candidate profile and upload your latest resume.",
    },
    {
      number: "02",
      title: "Discover opportunities",
      description:
        "Explore jobs and use AI-powered tools to improve your search.",
    },
    {
      number: "03",
      title: "Apply and track",
      description:
        "Apply to relevant jobs and monitor your application status.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            type="button"
            onClick={goToRegister}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087443] text-white">
              <BriefcaseBusiness size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Hire<span className="text-[#087443]">Onix</span>
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={goToRegister}
              className="text-sm font-semibold text-[#087443]"
            >
              Home
            </button>
            <button
              onClick={goToRegister}
              className="text-sm text-slate-600 transition hover:text-[#087443]"
            >
              Browse Jobs
            </button>
            <button
              onClick={goToRegister}
              className="text-sm text-slate-600 transition hover:text-[#087443]"
            >
              For Recruiters
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={goToRegister}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Log in
            </button>
            <button
              onClick={goToRegister}
              className="rounded-xl bg-[#087443] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#065d35]"
            >
              Get Started <ArrowRight size={15} className="ml-1 inline" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-1 border-t border-slate-100 bg-white px-5 py-4 md:hidden">
            {["Home", "Browse Jobs", "For Recruiters", "Log in", "Get Started"].map(
              (item) => (
                <button
                  key={item}
                  onClick={goToRegister}
                  className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-medium ${
                    item === "Get Started"
                      ? "bg-[#087443] font-semibold text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#f5faf7]">
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-green-100/60 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-[#087443] shadow-sm">
                <Sparkles size={16} />
                Your next opportunity starts here
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Your skills deserve{" "}
                <span className="text-[#087443]">
                  the right opportunity.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Find jobs that fit your ambitions, improve your resume with AI,
                and manage your job search in one place.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-9 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60"
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr_auto]">
                  <div className="flex items-center gap-3 px-3">
                    <Search size={19} className="shrink-0 text-[#087443]" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Job title or skill"
                      className="w-full min-w-0 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 border-t border-slate-100 px-3 sm:border-l sm:border-t-0">
                    <MapPin size={19} className="shrink-0 text-[#087443]" />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="City or location"
                      className="w-full min-w-0 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-[#087443] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#065d35]"
                  >
                    Find Jobs
                  </button>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#087443]" />
                  Personalized job discovery
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#087443]" />
                  AI-powered career tools
                </span>
              </div>

              <div className="mt-9">
                <button
                  onClick={goToRegister}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#087443] hover:gap-3"
                >
                  Explore all opportunities <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -right-4 -top-4 h-28 w-28 rounded-3xl bg-emerald-200/70" />
              <div className="absolute -bottom-5 -left-4 h-28 w-28 rounded-3xl bg-green-100" />

              <div className="relative rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-emerald-900/10 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Your career workspace
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                      Ready for your next move?
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#087443]">
                    <TrendingUp size={24} />
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-[#f5faf7] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#087443] shadow-sm">
                      <FileText size={21} />
                    </div>
                    <div>
                      <p className="font-semibold">Resume insights</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Know what to improve
                      </p>
                    </div>
                    <Sparkles size={18} className="ml-auto text-[#087443]" />
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="h-2 rounded-full bg-emerald-100">
                      <div className="h-2 w-4/5 rounded-full bg-[#087443]" />
                    </div>
                    <div className="h-2 w-4/5 rounded-full bg-slate-200" />
                    <div className="h-2 w-3/5 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    onClick={goToRegister}
                    className="rounded-2xl border border-slate-100 p-4 text-left transition hover:border-emerald-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#087443]">
                      <Target size={20} />
                    </div>
                    <p className="mt-4 text-sm font-bold">Smart matching</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Find relevant opportunities
                    </p>
                  </button>

                  <button
                    onClick={goToRegister}
                    className="rounded-2xl border border-slate-100 p-4 text-left transition hover:border-emerald-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#087443]">
                      <BriefcaseBusiness size={20} />
                    </div>
                    <p className="mt-4 text-sm font-bold">Career progress</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Track every application
                    </p>
                  </button>
                </div>

                <button
                  onClick={goToRegister}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#087443] py-3.5 text-sm font-semibold text-white transition hover:bg-[#065d35]"
                >
                  Start your journey <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-8 sm:grid-cols-3 lg:px-8">
            <div className="flex items-center justify-center gap-3">
              <Users size={23} className="text-[#087443]" />
              <div>
                <p className="font-bold">Candidates first</p>
                <p className="text-sm text-slate-500">A simpler job search</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={23} className="text-[#087443]" />
              <div>
                <p className="font-bold">AI-powered tools</p>
                <p className="text-sm text-slate-500">
                  Make informed career decisions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Building2 size={23} className="text-[#087443]" />
              <div>
                <p className="font-bold">Recruiter friendly</p>
                <p className="text-sm text-slate-500">
                  A streamlined hiring process
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#087443]">
              Built for your next step
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              More than a job board
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The right tools can make your job search more focused, organized
              and productive.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <button
                  type="button"
                  key={feature.title}
                  onClick={goToRegister}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#087443] transition group-hover:bg-[#087443] group-hover:text-white">
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#087443]">
                    Explore feature <ArrowRight size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#087443]">
                  Explore opportunities
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Opportunities that move you forward
                </h2>
                <p className="mt-3 text-slate-600">
                  Discover opportunities and take the next step in your career.
                </p>
              </div>
              <button
                onClick={goToRegister}
                className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#087443] sm:self-auto"
              >
                Browse all jobs <ArrowRight size={17} />
              </button>
            </div>

            {loading ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-12 w-12 rounded-xl bg-slate-200" />
                    <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                    <div className="mt-7 h-10 rounded-lg bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <button
                    type="button"
                    key={job._id}
                    onClick={goToRegister}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#087443]">
                        <BriefcaseBusiness size={22} />
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#087443]">
                        {job.jobType || "Opportunity"}
                      </span>
                    </div>

                    <h3 className="mt-5 w-full text-lg font-bold text-slate-900">
                      {job.title}
                    </h3>
                    <p className="mt-1 w-full text-sm text-slate-500">
                      {typeof job.company === "string"
                        ? job.company
                        : job.company?.name || job.company?.companyName || "Company"}
                    </p>

                    <div className="mt-5 flex w-full flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {job.location || "Location not specified"}
                      </span>
                      {job.workMode && (
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {job.workMode}
                        </span>
                      )}
                    </div>

                    {job.salary && (
                      <p className="mt-4 w-full text-sm font-semibold text-[#087443]">
                        {job.salary}
                      </p>
                    )}

                    <span className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#087443] hover:text-[#087443]">
                      View Job <ArrowRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <BriefcaseBusiness
                  size={32}
                  className="mx-auto text-slate-400"
                />
                <h3 className="mt-4 text-lg font-bold">
                  New opportunities are on the way
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Visit HireOnix to explore your career opportunities.
                </p>
                <button
                  onClick={goToRegister}
                  className="mt-5 inline-flex items-center gap-2 font-semibold text-[#087443]"
                >
                  Get started <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#087443]">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                From searching to getting hired
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Organize your search, discover relevant roles and keep moving
                forward with HireOnix.
              </p>
              <button
                onClick={goToRegister}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#087443] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#065d35]"
              >
                Create your account <ArrowRight size={17} />
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step) => (
                <button
                  type="button"
                  key={step.number}
                  onClick={goToRegister}
                  className="flex w-full gap-5 rounded-2xl border border-slate-200 p-5 text-left transition hover:border-emerald-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-extrabold text-[#087443]">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8 lg:pb-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 overflow-hidden rounded-3xl bg-[#063b2a] p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-200">
                For recruiters
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Meet the people who can move your business forward.
              </h2>
              <p className="mt-4 leading-7 text-emerald-50/75">
                Publish opportunities, review applicants and manage your hiring
                workflow from one place.
              </p>
            </div>
            <button
              onClick={goToRegister}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#063b2a] transition hover:bg-emerald-50"
            >
              Hire with HireOnix <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-9 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <button
            onClick={goToRegister}
            className="flex items-center gap-2 self-start"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#087443] text-white">
              <BriefcaseBusiness size={19} />
            </div>
            <span className="text-xl font-extrabold">
              Hire<span className="text-[#087443]">Onix</span>
            </span>
          </button>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <button onClick={goToRegister} className="hover:text-[#087443]">
              Home
            </button>
            <button onClick={goToRegister} className="hover:text-[#087443]">
              Browse Jobs
            </button>
            <button onClick={goToRegister} className="hover:text-[#087443]">
              Login
            </button>
            <button onClick={goToRegister} className="hover:text-[#087443]">
              Register
            </button>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} HireOnix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;