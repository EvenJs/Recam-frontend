import { Outlet, NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AgentLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
        <span className="font-bold text-blue-500 text-lg">recam</span>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-3 space-y-2">
          <NavLink
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium"
          >
            My Orders
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium"
          >
            Profile
          </NavLink>
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 text-sm text-muted-foreground"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-52 shrink-0 flex-col px-4 py-6 border-r min-h-screen">
          <div className="mb-8 px-2">
            <span className="font-bold text-lg tracking-tight text-blue-500">
              recam
            </span>
          </div>
          <div className="mb-4 px-2">
            <p className="text-sm text-muted-foreground truncate">
              Hi, {user?.email}
            </p>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-200 text-foreground"
                    : "text-muted-foreground hover:bg-slate-100"
                }`
              }
            >
              My Orders
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-200 text-foreground"
                    : "text-muted-foreground hover:bg-slate-100"
                }`
              }
            >
              Profile
            </NavLink>
          </nav>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
