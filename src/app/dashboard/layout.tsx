"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, sidebarOpen } = useAppStore();

  useEffect(() => {
    // For demo, we won't force redirect if not authenticated
    // In production, uncomment this:
    // if (!isAuthenticated) {
    //   router.push("/login");
    // }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300 pt-16 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
