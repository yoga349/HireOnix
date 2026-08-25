import { Bell, UserCircle } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#087443] text-white flex items-center justify-center shadow-sm">
          <span className="font-bold text-lg">H</span>
        </div>

        <span className="text-xl font-bold text-[#063b2a]">
          Hireonix
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          className="relative w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
        >
          <Bell size={20} className="text-gray-600" />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <UserCircle size={32} className="text-gray-400" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-400 capitalize">
              {user?.role || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;