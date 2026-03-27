import { Outlet, NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/dashboard", label: "Orders" },
  { to: "/agents", label: "Staff" },
  { to: "/profile", label: "Profile" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Topbar */}
      <header className="bg-[#1DA1F2] px-4 md:px-8 flex items-center h-14 gap-4 md:gap-8">
        <span className="text-white font-bold text-lg tracking-tight">
          recam
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
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

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={logout}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#1DA1F2] px-4 pb-3 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-white font-medium"
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Page content */}
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
