import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await login(values.email, values.password);
      useAuthStore.getState().setAuth(data.token, {
        userId: data.userId,
        email: data.email,
        role: data.role,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const message =
        status === 401
          ? "Invalid email or password"
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Something went wrong");
      setError("root", { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-8 border rounded-lg bg-card shadow-sm">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Remp</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Root / API error */}
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
