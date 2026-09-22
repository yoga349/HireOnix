import { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  Shield,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/api/admin/users");

      setUsers(response.data?.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load users",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find((item) => item._id === userId);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        user?.name || "this user"
      }? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(userId);
      setError("");
      setMessage("");

      await api.delete(`/api/admin/users/${userId}`);

      setUsers((previous) =>
        previous.filter((user) => user._id !== userId),
      );

      setMessage("User deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to delete user",
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole =
        role === "all" ||
        user.role?.toLowerCase() === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const candidateCount = users.filter(
    (user) => user.role?.toLowerCase() === "candidate",
  ).length;

  const recruiterCount = users.filter(
    (user) => user.role?.toLowerCase() === "recruiter",
  ).length;

  const adminCount = users.filter(
    (user) => user.role?.toLowerCase() === "admin",
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#087443]">
            <ShieldCheck size={17} />
            Administration
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            User Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage candidates, recruiters and administrator accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#087443] hover:text-[#087443] transition disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {message && (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 text-sm">
          <div className="flex items-center gap-2">
            <UserCheck size={17} />
            <span>{message}</span>
          </div>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="hover:text-emerald-900"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-4 text-sm">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="hover:text-red-800"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Users"
          value={users.length}
          icon={UsersIcon}
        />

        <SummaryCard
          label="Candidates"
          value={candidateCount}
          icon={UserRound}
        />

        <SummaryCard
          label="Recruiters"
          value={recruiterCount}
          icon={BriefcaseBusiness}
        />

        <SummaryCard
          label="Admins"
          value={adminCount}
          icon={Shield}
        />
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Search Users
            </label>

            <p className="text-xs text-gray-400 mb-3">
              Find users by their name or email address.
            </p>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter name or email..."
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-52">
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Filter by Role
            </label>

            <p className="text-xs text-gray-400 mb-3">
              Select a user category.
            </p>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="candidate">Candidates</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {users.length}
            </span>{" "}
            users
          </p>

          {(search || role !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRole("all");
              }}
              className="text-xs font-semibold text-[#087443] hover:text-[#065d35] transition"
            >
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 min-h-[350px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={34}
              className="animate-spin text-[#087443]"
            />

            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <section className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <UsersIcon
              size={28}
              className="text-[#087443]"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            No users found
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Try changing your search or role filter.
          </p>

          {(search || role !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRole("all");
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065d35] transition"
            >
              Clear Filters
            </button>
          )}
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-5 px-6 py-4 bg-gray-50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                deleting={deleting}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:border-[#087443]/30 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-400">
            {label}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#087443]/10 flex items-center justify-center">
          <Icon
            size={19}
            className="text-[#087443]"
          />
        </div>
      </div>
    </div>
  );
};

const UserRow = ({
  user,
  deleting,
  onDelete,
}) => {
  const isAdmin =
    user.role?.toLowerCase() === "admin";

  return (
    <div className="px-5 md:px-6 py-5 hover:bg-gray-50/70 transition">
      <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-5 items-center">
        <UserInfo user={user} />

        <p className="text-sm text-gray-500 truncate">
          {user.email || "No email"}
        </p>

        <RoleBadge role={user.role} />

        <p className="text-sm text-gray-500">
          {user.createdAt
            ? new Date(
                user.createdAt,
              ).toLocaleDateString()
            : "—"}
        </p>

        <div className="flex justify-end">
          <ActionButton
            isAdmin={isAdmin}
            deleting={deleting === user._id}
            onClick={() =>
              onDelete(user._id)
            }
          />
        </div>
      </div>

      <div className="lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <UserInfo user={user} />

          <ActionButton
            isAdmin={isAdmin}
            deleting={deleting === user._id}
            onClick={() =>
              onDelete(user._id)
            }
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p className="text-[11px] text-gray-400">
              Email
            </p>

            <p className="text-sm text-gray-700 truncate mt-1">
              {user.email || "No email"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p className="text-[11px] text-gray-400">
              Joined
            </p>

            <p className="text-sm text-gray-700 mt-1">
              {user.createdAt
                ? new Date(
                    user.createdAt,
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <RoleBadge role={user.role} />
        </div>
      </div>
    </div>
  );
};

const UserInfo = ({ user }) => {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-11 h-11 rounded-full bg-[#087443]/10 flex items-center justify-center overflow-hidden shrink-0 border border-[#087443]/10">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCheck
            size={19}
            className="text-[#087443]"
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {user.name || "Unnamed User"}
        </p>

        <p className="text-xs text-gray-400 truncate mt-0.5">
          User ID: {user._id}
        </p>
      </div>
    </div>
  );
};

const ActionButton = ({
  isAdmin,
  deleting,
  onClick,
}) => {
  if (isAdmin) {
    return (
      <div
        title="Admin accounts are protected"
        className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"
      >
        <Shield
          size={17}
          className="text-gray-400"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deleting}
      title="Delete user"
      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition disabled:opacity-50"
    >
      {deleting ? (
        <Loader2
          size={17}
          className="animate-spin"
        />
      ) : (
        <Trash2 size={17} />
      )}
    </button>
  );
};

const RoleBadge = ({ role }) => {
  const normalized =
    role?.toLowerCase() || "candidate";

  const styles = {
    candidate:
      "bg-blue-50 text-blue-600 border-blue-100",
    recruiter:
      "bg-purple-50 text-purple-600 border-purple-100",
    admin:
      "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold ${
        styles[normalized] ||
        "bg-gray-50 text-gray-500 border-gray-100"
      }`}
    >
      {normalized.charAt(0).toUpperCase() +
        normalized.slice(1)}
    </span>
  );
};

export default Users;