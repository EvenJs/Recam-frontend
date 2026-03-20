import { Outlet, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AgentLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-slate-50 border-r flex flex-col px-4 py-6">
        <div className="mb-8 px-2">
          <span className="font-bold text-lg tracking-tight text-blue-500">
            recam
          </span>
        </div>

        <div className="mb-4 px-2">
          <p className="text-sm text-muted-foreground">Hi, {user?.email}</p>
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
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
