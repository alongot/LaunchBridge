"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Waves, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { useAppStore } from "@/stores/app-store";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loginAsDemo } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo, just use demo login
    loginAsDemo("startup");
    toast.success("Welcome back!");
    router.push("/dashboard");
    setIsLoading(false);
  };

  const handleDemoLogin = (role: "startup" | "investor") => {
    loginAsDemo(role);
    toast.success(`Logged in as demo ${role}!`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <Waves className="h-10 w-10 text-[var(--primary)]" />
          <span className="text-2xl font-semibold">LaunchBridge</span>
        </div>

        <h1 className="text-3xl font-[var(--font-heading)] mb-2">
          Welcome back
        </h1>
        <p className="text-[var(--muted)] mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-[var(--input-border)]"
              />
              <span className="text-sm text-[var(--muted)]">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Demo login buttons */}
        <div className="mt-8 pt-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted)] text-center mb-4">
            Or try a demo account
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleDemoLogin("startup")}
            >
              Demo Startup
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin("investor")}
            >
              Demo Investor
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[var(--primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
