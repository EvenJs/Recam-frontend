import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agents", label: "Agents", icon: Users, adminOnly: true },
  { to: "/profile", label: "Profile", icon: User },
];

export default function RootLayout() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-60 border-r bg-background shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b">
          <span className="text-lg font-semibold tracking-tight">Remp</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navLinks
            .filter((link) => !link.adminOnly || isAdmin)
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate mb-1">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b flex items-center px-6 shrink-0 bg-background">
          <span className="text-sm text-muted-foreground ml-auto">
            {user?.email}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
