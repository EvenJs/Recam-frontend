import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "@/features/listings/components/AdminDashboard";
import AgentDashboard from "@/features/listings/components/AgentDashboard";

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <AgentDashboard />;
}
