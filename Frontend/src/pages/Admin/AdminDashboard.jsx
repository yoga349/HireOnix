import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  Building2,
  FileText,
  UserCheck,
  Loader2,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    recruiters: 0,
    candidates: 0,
    jobs: 0,
    applications: 0,
    companies: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

     const response = await api.get("/api/admin/dashboard");

      const dashboard = response.data?.dashboard || {};

      setStats({
        users: dashboard.totalUsers || 0,
        recruiters: dashboard.totalRecruiters || 0,
        candidates: dashboard.totalCandidates || 0,
        jobs: dashboard.totalJobs || 0,
        applications: dashboard.totalApplications || 0,
        companies: dashboard.totalCompanies || 0,
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load admin dashboard",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#087443]" />

          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalUsers = stats.users;

  const candidatePercentage =
    totalUsers > 0 ? Math.round((stats.candidates / totalUsers) * 100) : 0;

  const recruiterPercentage =
    totalUsers > 0 ? Math.round((stats.recruiters / totalUsers) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#087443]">
            <ShieldCheck size={17} />
            Administration
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor users, jobs, companies and platform activity.
          </p>
        </div>

        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-[#087443] hover:text-[#087443] transition disabled:opacity-60"
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm">
          <span>{error}</span>

          <button
            onClick={() => fetchDashboard()}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard
          title="Total Users"
          value={stats.users}
          description="Registered users"
          icon={Users}
        />

        <StatCard
          title="Candidates"
          value={stats.candidates}
          description="Candidate accounts"
          icon={UserCheck}
        />

        <StatCard
          title="Recruiters"
          value={stats.recruiters}
          description="Recruiter accounts"
          icon={Users}
        />

        <StatCard
          title="Jobs"
          value={stats.jobs}
          description="Total job postings"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Applications"
          value={stats.applications}
          description="Total applications"
          icon={FileText}
        />

        <StatCard
          title="Companies"
          value={stats.companies}
          description="Registered companies"
          icon={Building2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-7 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center">
                <Users size={20} className="text-[#087443]" />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">User Overview</h2>

                <p className="text-xs text-gray-400 mt-1">
                  Candidate and recruiter distribution
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-7 space-y-6">
            <DistributionRow
              label="Candidates"
              value={stats.candidates}
              percentage={candidatePercentage}
            />

            <DistributionRow
              label="Recruiters"
              value={stats.recruiters}
              percentage={recruiterPercentage}
            />

            <div className="grid grid-cols-2 gap-4 pt-2">
              <MiniStat label="Candidates" value={stats.candidates} />

              <MiniStat label="Recruiters" value={stats.recruiters} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-7 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-[#087443]" />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Platform Overview</h2>

                <p className="text-xs text-gray-400 mt-1">
                  Current Hireonix platform activity
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-7">
            <OverviewRow
              icon={Users}
              label="Registered Users"
              value={stats.users}
            />

            <OverviewRow
              icon={BriefcaseBusiness}
              label="Job Postings"
              value={stats.jobs}
            />

            <OverviewRow
              icon={FileText}
              label="Applications"
              value={stats.applications}
            />

            <OverviewRow
              icon={Building2}
              label="Companies"
              value={stats.companies}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-[#087443]/30 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>

          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-[#087443]" />
        </div>
      </div>
    </div>
  );
};

const DistributionRow = ({ label, value, percentage }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>

        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>

      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#087443] rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {percentage}% of registered users
      </p>
    </div>
  );
};

const MiniStat = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

const OverviewRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon size={17} className="text-gray-500" />
        </div>

        <span className="text-sm text-gray-600">{label}</span>
      </div>

      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  );
};

export default AdminDashboard;
