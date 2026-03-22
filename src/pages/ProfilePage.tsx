import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import { getMe } from "@/api/users.api";

const roleLabel: Record<string, string> = {
  PhotographyCompany: "Photography Company",
  Agent: "Agent",
};

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="text-xl font-semibold">Profile</h1>

      {/* User info */}
      <div className="border rounded-lg p-6 space-y-4 bg-white">
        <h2 className="text-sm font-medium">Account Details</h2>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <Badge variant="secondary">
                {user?.role ? (roleLabel[user.role] ?? user.role) : "—"}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="border rounded-lg p-6 bg-white">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
