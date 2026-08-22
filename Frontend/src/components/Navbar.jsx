import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-[#087443] text-white flex items-center justify-center">
          <span className="font-bold">H</span>
        </div>

        <span className="text-xl font-bold text-[#063b2a]">
          Hireonix
        </span>

      </div>


      <div className="hidden md:flex items-center w-80 relative">

        <Search
          size={18}
          className="absolute left-3 text-gray-400"
        />

        <input
          placeholder="Search jobs..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-[#087443]"
        />

      </div>


      <div className="flex items-center gap-4">

        <button className="relative w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center">

          <Bell
            size={20}
            className="text-gray-600"
          />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />

        </button>


        <div className="flex items-center gap-2">

          <UserCircle
            size={32}
            className="text-gray-400"
          />

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