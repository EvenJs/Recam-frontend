import { useAuthStore } from "@/store/authStore";
import AdminLayout from "./AdminLayout";
import AgentLayout from "./AgentLayout";

export default function RoleBasedLayout() {
  const user = useAuthStore((state) => state.user);
  return user?.role === "PhotographyCompany" ? (
    <AdminLayout />
  ) : (
    <AgentLayout />
  );
}
