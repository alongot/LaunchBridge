"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Waves, Rocket, TrendingUp, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") as "startup" | "investor" | null;

  const [selectedRole, setSelectedRole] = useState<"startup" | "investor" | null>(
    initialRole
  );
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, setUserRole } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: initialRole || undefined,
    },
  });

  const handleRoleSelect = (role: "startup" | "investor") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create demo user
    const profile = {
      id: `demo-${Date.now()}`,
      email: data.email,
      role: data.role,
      name: data.email.split("@")[0],
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
    };

    setAuth(profile);
    setUserRole(data.role);
    toast.success("Account created successfully!");

    // Redirect to onboarding
    router.push(`/onboarding/${data.role}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
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
            Create your free account
          </h1>
          <p className="text-[var(--muted)] mb-8">
            Join the global startup ecosystem - 100% free, forever
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRole === "startup" &&
                      "ring-2 ring-[var(--primary)] border-[var(--primary)]"
                  )}
                  onClick={() => handleRoleSelect("startup")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
                      <Rocket className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <p className="font-medium">Startup Founder</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Looking for funding
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRole === "investor" &&
                      "ring-2 ring-[var(--secondary)] border-[var(--secondary)]"
                  )}
                  onClick={() => handleRoleSelect("investor")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-[var(--secondary)]" />
                    </div>
                    <p className="font-medium">Investor</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Looking to invest
                    </p>
                  </CardContent>
                </Card>
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-[var(--error)]">
                  {errors.role.message}
                </p>
              )}
            </div>

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
              placeholder="Create a strong password"
              error={errors.password?.message}
              helperText="Min 8 chars, with uppercase, lowercase, and number"
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Free Account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Pattern */}
      <div className="hidden lg:flex flex-1 bg-[var(--primary)] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-[var(--font-heading)] mb-6">
            Connect with the right investors for your startup
          </h2>
          <p className="text-white/80 text-lg">
            LaunchBridge uses AI to match you with investors who align with your
            stage, sector, and funding needs. No more cold outreach.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-semibold">85%</p>
              <p className="text-white/70 text-sm">Match accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">2 days</p>
              <p className="text-white/70 text-sm">Avg. response time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
