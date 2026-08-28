import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  User,
  Sparkles,
  Bookmark,
  Users,
  Building2,
  BarChart3,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  const candidateLinks = [
    {
      name: "Dashboard",
      path: "/candidate/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Find Jobs",
      path: "/candidate/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applications",
      path: "/candidate/applications",
      icon: FileText,
    },
    {
      name: "Saved Jobs",
      path: "/candidate/saved-jobs",
      icon: Bookmark,
    },
    {
      name: "Resume Analyzer",
      path: "/candidate/resume-analyzer",
      icon: Sparkles,
    },
     {
      name: "Job Matcher",
      path: "/candidate/job-matcher",
      icon: Sparkles,
    },
    {
      name: "Profile",
      path: "/candidate/profile",
      icon: User,
    },
  ];

  const recruiterLinks = [
    {
      name: "Dashboard",
      path: "/recruiter/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      path: "/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applicants",
      path: "/recruiter/applicants",
      icon: Users,
    },
    {
      name: "Company",
      path: "/recruiter/company",
      icon: Building2,
    },
    {
      name: "Analytics",
      path: "/recruiter/analytics",
      icon: BarChart3,
    },
   
    {
      name: "Profile",
      path: "/recruiter/profile",
      icon: User,
    },
  ];

  const links = role === "candidate" ? candidateLinks : recruiterLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="hidden md:flex w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 flex-col">
      <nav className="p-4 space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-[#087443]/5 hover:text-[#087443] transition"
            >
              <Icon size={19} />

              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={19} />

          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
