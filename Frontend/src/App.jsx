import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Jobs from "./pages/candidate/Jobs";
import JobDetails from "./pages/candidate/JobDetails";
import SavedJobs from "./pages/candidate/SavedJobs";
import Applications from "./pages/candidate/Applications";
import Profile from "./pages/candidate/Profile";
import ResumeAnalyzer from "./pages/candidate/ResumeAnalyzer";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateJob from "./pages/recruiter/CreateJob";
import RecruiterJobs from "./pages/recruiter/Jobs";
import Applicants from "./pages/recruiter/Applicants";
import JobDetail from "./pages/recruiter/JobDetail";
import EditJob from "./pages/recruiter/EditJob";
import Analytics from "./pages/recruiter/Analytics";
import Company from "./pages/recruiter/Company";
import CompanyDetails from "./pages/recruiter/CompanyDetails";
import RecProfile from "./pages/recruiter/RecProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Job from "./pages/admin/Job";
import Application from "./pages/admin/Application";
import Companies from "./pages/admin/Companies";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/candidate/dashboard"
              element={<CandidateDashboard />}
            />
            <Route path="/candidate/jobs" element={<Jobs />} />
            <Route path="/candidate/jobs/:id" element={<JobDetails />} />
            <Route path="/candidate/saved-jobs" element={<SavedJobs />} />
            <Route path="/candidate/applications" element={<Applications />} />
            <Route path="/candidate/profile" element={<Profile />} />
            <Route
              path="/candidate/resume-analyzer"
              element={<ResumeAnalyzer />}
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />
            <Route path="/recruiter/jobs/create" element={<CreateJob />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={<Applicants />}
            />
            <Route path="/recruiter/jobs/:id" element={<JobDetail />} />
            <Route path="/recruiter/jobs/:id/edit" element={<EditJob />} />
            <Route path="/recruiter/analytics" element={<Analytics />} />
            <Route path="/recruiter/company" element={<Company />} />
            <Route path="/recruiter/company/my" element={<CompanyDetails />} />
            <Route path="/recruiter/profile" element={<RecProfile />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/jobs" element={<Job />} />
            <Route path="/admin/applications" element={<Application />} />
            <Route path="/admin/companies" element={<Companies />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
