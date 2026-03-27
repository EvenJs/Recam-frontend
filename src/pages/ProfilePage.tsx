import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import { getMe } from "@/api/users.api";

const roleLabel: Record<string, string> = {
  PhotographyCompany: "Photography Company",
  Agent: "Agent",
};

export default function ProfilePage() {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Placeholder — wire to backend when profile update endpoint is available
  const handleSaveProfile = () => {
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8">
      <h1 className="text-2xl font-semibold text-center">Profile Settings</h1>

      {/* Profile card */}
      <div className="border rounded-xl p-6 bg-white space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-14 h-14 text-slate-400"
                fill="currentColor"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
          <Button
            size="sm"
            className="rounded-full px-5 bg-slate-800 hover:bg-slate-700 text-xs"
            onClick={() => avatarRef.current?.click()}
          >
            Change Photo
          </Button>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Fields */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Email</Label>
              <Input
                value={user?.email ?? ""}
                readOnly
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Role</Label>
              <div>
                <Badge variant="outline" className="text-xs">
                  {user?.role ? (roleLabel[user.role] ?? user.role) : "—"}
                </Badge>
              </div>
            </div>

            {/* Save profile button — separate from password */}
            <Button
              className="w-full bg-slate-800 hover:bg-slate-700 rounded-full"
              onClick={handleSaveProfile}
            >
              Save Profile
            </Button>
          </div>
        )}
      </div>

      {/* Change password — separate card, separate save button */}
      <div className="border rounded-xl p-6 bg-white">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
