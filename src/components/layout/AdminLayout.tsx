import { Outlet, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/dashboard", label: "Orders" },
  { to: "/agents", label: "Staff" },
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Topbar */}
      <header className="bg-[#1DA1F2] px-8 py-0 flex items-center h-14 gap-8">
        {/* Logo */}
        <span className="text-white font-bold text-lg tracking-tight">
          recam
        </span>

        {/* Nav */}
        <nav className="flex items-center gap-6 flex-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-blue-100 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-white hover:text-blue-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Page content */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
