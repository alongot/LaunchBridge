"use client";

import { useState } from "react";
import { Bell, Shield, Palette, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { currentUser, logout } = useAppStore();
  const [notifications, setNotifications] = useState({
    newMatches: true,
    introRequests: true,
    messages: true,
    marketing: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Notification preference updated");
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      logout();
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-[var(--font-heading)]">Settings</h1>
        <p className="text-[var(--muted)] mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Manage your account details and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={currentUser?.email || ""}
            disabled
            helperText="Contact support to change your email"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "newMatches" as const,
              label: "New Matches",
              description: "Get notified when we find new matches for you",
            },
            {
              key: "introRequests" as const,
              label: "Introduction Requests",
              description: "Receive alerts for new introduction requests",
            },
            {
              key: "messages" as const,
              label: "Messages",
              description: "Get notified when you receive messages",
            },
            {
              key: "marketing" as const,
              label: "Marketing",
              description: "Receive updates about new features and tips",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
            >
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-[var(--muted)]">{item.description}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(item.key)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  notifications[item.key]
                    ? "bg-[var(--primary)]"
                    : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                    notifications[item.key] ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look of the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-[var(--muted)]">
                Choose your preferred color scheme
              </p>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-white border-2 border-[var(--primary)]" />
              <button className="w-8 h-8 rounded-full bg-gray-900 border-2 border-transparent" />
              <button className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-900 border-2 border-transparent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-[var(--muted)]">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
