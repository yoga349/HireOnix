import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f9f8]">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;