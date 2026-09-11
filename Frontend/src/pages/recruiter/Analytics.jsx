import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    jobs: {
      total: 0,
      active: 0,
      expired: 0,
      closed: 0,
    },
    applications: {
      total: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/api/analytics/recruiter");

      const data = response.data.analytics;

      setAnalytics({
        jobs: {
          total: data?.jobs?.total ?? 0,
          active: data?.jobs?.active ?? 0,
          expired: data?.jobs?.expired ?? 0,
          closed: data?.jobs?.closed ?? 0,
        },
        applications: {
          total: data?.applications?.total ?? 0,
          applied: data?.applications?.applied ?? 0,
          shortlisted: data?.applications?.shortlisted ?? 0,
          interview: data?.applications?.interview ?? 0,
          selected: data?.applications?.selected ?? 0,
          rejected: data?.applications?.rejected ?? 0,
        },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const totalApplications = analytics.applications.total;

  const selectionRate =
    totalApplications > 0
      ? Math.round((analytics.applications.selected / totalApplications) * 100)
      : 0;

  const shortlistRate =
    totalApplications > 0
      ? Math.round(
          (analytics.applications.shortlisted / totalApplications) * 100,
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#087443]" />
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-[#087443]">Recruiter</p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">Analytics</h1>

          <p className="text-gray-500 mt-2">
            Track your job postings and application performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:border-[#087443] hover:text-[#087443] transition disabled:opacity-60"
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs"
          value={analytics.jobs.total}
          description="Total jobs posted"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Active Jobs"
          value={analytics.jobs.active}
          description="Currently active"
          icon={TrendingUp}
        />

        <StatCard
          title="Total Applications"
          value={analytics.applications.total}
          description="Applications received"
          icon={Users}
        />

        <StatCard
          title="Selected"
          value={analytics.applications.selected}
          description="Candidates selected"
          icon={UserCheck}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#087443]/10 flex items-center justify-center">
                <BriefcaseBusiness size={19} className="text-[#087443]" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Job Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Current status of your job postings
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <OverviewItem
              label="Total Jobs"
              value={analytics.jobs.total}
              icon={BriefcaseBusiness}
            />

            <OverviewItem
              label="Active"
              value={analytics.jobs.active}
              icon={TrendingUp}
            />

            <OverviewItem
              label="Expired"
              value={analytics.jobs.expired}
              icon={Clock}
            />

            <OverviewItem
              label="Closed"
              value={analytics.jobs.closed}
              icon={XCircle}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users size={19} className="text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Application Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Candidate application pipeline
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <ApplicationRow
              label="Applied"
              value={analytics.applications.applied}
              icon={Users}
              percentage={getPercentage(
                analytics.applications.applied,
                totalApplications,
              )}
            />

            <ApplicationRow
              label="Shortlisted"
              value={analytics.applications.shortlisted}
              icon={UserCheck}
              percentage={getPercentage(
                analytics.applications.shortlisted,
                totalApplications,
              )}
            />

            <ApplicationRow
              label="Interview"
              value={analytics.applications.interview}
              icon={CalendarCheck}
              percentage={getPercentage(
                analytics.applications.interview,
                totalApplications,
              )}
            />

            <ApplicationRow
              label="Selected"
              value={analytics.applications.selected}
              icon={CheckCircle2}
              percentage={getPercentage(
                analytics.applications.selected,
                totalApplications,
              )}
            />

            <ApplicationRow
              label="Rejected"
              value={analytics.applications.rejected}
              icon={XCircle}
              percentage={getPercentage(
                analytics.applications.rejected,
                totalApplications,
              )}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#063b2a] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-200 font-medium">
                Shortlist Rate
              </p>

              <h2 className="text-4xl font-bold mt-2">{shortlistRate}%</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <UserCheck size={22} />
            </div>
          </div>

          <p className="text-sm text-emerald-50/70 mt-4">
            Percentage of applicants who have been shortlisted.
          </p>

          <div className="mt-5 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{
                width: `${shortlistRate}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Selection Rate
              </p>

              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                {selectionRate}%
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Percentage of applicants who have been selected.
          </p>

          <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#087443] rounded-full transition-all"
              style={{
                width: `${selectionRate}%`,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const getPercentage = (value, total) => {
  if (!total) return 0;

  return Math.round((value / total) * 100);
};

const StatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#087443]/30 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>

          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#087443]/10 flex items-center justify-center">
          <Icon size={20} className="text-[#087443]" />
        </div>
      </div>
    </div>
  );
};

const OverviewItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
          <Icon size={17} className="text-[#087443]" />
        </div>

        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      <p className="text-sm font-medium text-gray-500 mt-3">{label}</p>
    </div>
  );
};

const ApplicationRow = ({ label, value, percentage, icon: Icon }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-400" />

          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{value}</span>

          <span className="text-xs text-gray-400">{percentage}%</span>
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#087443] rounded-full transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default RecruiterAnalytics;
