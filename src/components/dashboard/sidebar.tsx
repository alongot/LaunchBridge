"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Waves,
  LayoutDashboard,
  Users,
  Send,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Matches",
    href: "/dashboard/matches",
    icon: Users,
  },
  {
    name: "Intros",
    href: "/dashboard/intros",
    icon: Send,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, sidebarOpen, setSidebarOpen, logout } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-[var(--border)] z-50 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Waves className="h-8 w-8 text-[var(--primary)] shrink-0" />
              {sidebarOpen && (
                <span className="text-lg font-semibold">LaunchBridge</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-black/5 hidden lg:block"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  !sidebarOpen && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive
                          ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)]"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[var(--border)]">
            <div
              className={cn(
                "flex items-center gap-3",
                !sidebarOpen && "justify-center"
              )}
            >
              <Avatar name={currentUser?.name} size="sm" />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {currentUser?.email}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 mt-3 rounded-lg text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)] transition-colors",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-4 z-30 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-black/5"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Waves className="h-8 w-8 text-[var(--primary)]" />
          <span className="text-lg font-semibold">LaunchBridge</span>
        </Link>
        <Avatar name={currentUser?.name} size="sm" />
      </header>
    </>
  );
}
