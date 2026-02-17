"use client";

import { useState } from "react";
import { Send, Inbox, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard";
import { useAppStore } from "@/stores/app-store";
import { mockStartups, mockInvestors, mockProfiles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type TabType = "sent" | "received";

export default function IntrosPage() {
  const [activeTab, setActiveTab] = useState<TabType>("sent");
  const { currentUser, introRequests, matches } = useAppStore();

  const sentIntros = introRequests.filter(
    (ir) => ir.senderId === currentUser?.id
  );
  const receivedIntros = introRequests.filter(
    (ir) => ir.receiverId === currentUser?.id
  );

  const activeIntros = activeTab === "sent" ? sentIntros : receivedIntros;

  const getIntroDetails = (intro: (typeof introRequests)[0]) => {
    const match = matches.find((m) => m.id === intro.matchId);
    const senderProfile = mockProfiles.find((p) => p.id === intro.senderId);
    const receiverProfile = mockProfiles.find((p) => p.id === intro.receiverId);
    const startup = mockStartups.find((s) => s.id === match?.startupId);
    const investor = mockInvestors.find((i) => i.id === match?.investorId);

    return {
      match,
      senderProfile,
      receiverProfile,
      startup,
      investor,
      displayName:
        activeTab === "sent"
          ? senderProfile?.role === "startup"
            ? investor?.firmName
            : startup?.companyName
          : senderProfile?.role === "startup"
          ? startup?.companyName
          : investor?.firmName,
      subtitle:
        activeTab === "sent"
          ? senderProfile?.role === "startup"
            ? investor?.title
            : startup?.tagline
          : senderProfile?.role === "startup"
          ? startup?.tagline
          : investor?.title,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-[var(--font-heading)]">Introductions</h1>
        <p className="text-[var(--muted)] mt-1">
          Manage your introduction requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("sent")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "sent"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          <Send className="h-4 w-4" />
          Sent
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
            {sentIntros.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "received"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          <Inbox className="h-4 w-4" />
          Received
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
            {receivedIntros.length}
          </span>
        </button>
      </div>

      {/* Intro List */}
      {activeIntros.length === 0 ? (
        <EmptyState
          icon={activeTab === "sent" ? Send : Inbox}
          title={
            activeTab === "sent"
              ? "No introductions sent yet"
              : "No introductions received yet"
          }
          description={
            activeTab === "sent"
              ? "Browse your matches and request introductions to get started."
              : "Introductions from your matches will appear here."
          }
          action={
            activeTab === "sent"
              ? {
                  label: "Browse Matches",
                  onClick: () => (window.location.href = "/dashboard/matches"),
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {activeIntros.map((intro) => {
            const details = getIntroDetails(intro);

            return (
              <Card key={intro.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar name={details.displayName} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {details.displayName}
                          </h3>
                          <p className="text-sm text-[var(--muted)]">
                            {details.subtitle}
                          </p>
                        </div>
                        <StatusBadge status={intro.status} />
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-[var(--foreground)]">
                          {intro.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 text-sm text-[var(--muted)]">
                          <Clock className="h-4 w-4" />
                          <span>
                            {activeTab === "sent" ? "Sent" : "Received"}{" "}
                            {new Date(intro.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {activeTab === "received" &&
                          intro.status === "pending" && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            </div>
                          )}

                        {intro.status === "accepted" && (
                          <Button size="sm">Start Conversation</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
