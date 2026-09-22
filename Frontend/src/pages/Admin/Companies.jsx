import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Loader2,
  MapPin,
  Globe,
  Users,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/companies");

      setCompanies(response.data.companies || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load companies"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmed) return;

    try {
      setDeleting(companyId);
      setError("");
      setMessage("");

      await api.delete(`/api/admin/companies/${companyId}`);

      setCompanies((previous) =>
        previous.filter((company) => company._id !== companyId)
      );

      setMessage("Company deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to delete company"
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const value = search.toLowerCase().trim();

    return (
      company.name?.toLowerCase().includes(value) ||
      company.industry?.toLowerCase().includes(value) ||
      company.location?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#087443]">
            Administration
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Companies
          </h1>

          <p className="text-gray-500 mt-2">
            Manage companies registered on Hireonix.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#087443]/10 text-[#087443]">
          <Building2 size={18} />

          <span className="text-sm font-semibold">
            {companies.length} Companies
          </span>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 text-sm">
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            className="hover:text-emerald-900 transition"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 text-red-600 px-5 py-3 text-sm">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="hover:text-red-800 transition"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Search */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-xl">
          <Search
            size={19}
            strokeWidth={2}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, industry or location..."
            className="
              w-full
              h-12
              pl-12
              pr-11
              rounded-xl
              bg-white
              border
              border-gray-300
              text-sm
              text-gray-900
              placeholder:text-gray-500
              shadow-sm
              outline-none
              transition-all
              duration-200
              hover:border-gray-400
              focus:border-[#087443]
              focus:ring-2
              focus:ring-[#087443]/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                w-7
                h-7
                rounded-lg
                flex
                items-center
                justify-center
                text-gray-400
                hover:text-gray-700
                hover:bg-gray-100
                transition
              "
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredCompanies.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {companies.length}
              </span>{" "}
              companies
            </p>
          </div>
        )}
      </section>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            size={34}
            className="animate-spin text-[#087443]"
          />
        </div>
      ) : filteredCompanies.length === 0 ? (
        /* Empty State */
        <section className="bg-white rounded-2xl border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#087443]/10 flex items-center justify-center">
            <Building2
              size={28}
              className="text-[#087443]"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-5">
            No companies found
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {search
              ? "Try changing your search."
              : "No companies have been registered yet."}
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="
                mt-5
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                text-[#087443]
                bg-[#087443]/10
                hover:bg-[#087443]/15
                transition
              "
            >
              Clear search
            </button>
          )}
        </section>
      ) : (
        /* Company Cards */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredCompanies.map((company) => (
            <section
              key={company._id}
              className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                p-6
                shadow-sm
                hover:border-[#087443]/30
                hover:shadow-md
                transition-all
                duration-200
              "
            >
              {/* Company Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-[#087443]/10
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Building2
                      size={21}
                      className="text-[#087443]"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 truncate">
                      {company.name || "Unnamed Company"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {company.industry || "Industry not specified"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(company._id)}
                  disabled={deleting === company._id}
                  className="
                    w-9
                    h-9
                    rounded-lg
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    hover:text-red-500
                    hover:border-red-200
                    hover:bg-red-50
                    transition
                    shrink-0
                    disabled:opacity-50
                  "
                  title="Delete company"
                >
                  {deleting === company._id ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              {/* Company Information */}
              <div className="mt-6 space-y-3">
                {company.location && (
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <MapPin
                        size={15}
                        className="text-gray-400"
                      />
                    </div>

                    <span className="truncate">
                      {company.location}
                    </span>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Globe
                        size={15}
                        className="text-gray-400"
                      />
                    </div>

                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        text-[#087443]
                        hover:underline
                        truncate
                      "
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.size && (
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Users
                        size={15}
                        className="text-gray-400"
                      />
                    </div>

                    <span>{company.size}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {company.description && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    About
                  </p>

                  <p className="text-sm text-gray-500 leading-6 line-clamp-3">
                    {company.description}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;