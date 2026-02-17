"use client";

import Link from "next/link";
import { Users, Send, TrendingUp, Eye, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard, MatchCard } from "@/components/dashboard";
import { useAppStore } from "@/stores/app-store";
import { mockStartups, mockInvestors } from "@/lib/mock-data";

export default function DashboardPage() {
  const { currentUser, userRole, matches, introRequests } = useAppStore();

  const pendingMatches = matches.filter((m) => m.status === "pending");
  const sentIntros = introRequests.filter((ir) => ir.senderId === currentUser?.id);
  const receivedIntros = introRequests.filter(
    (ir) => ir.receiverId === currentUser?.id
  );

  // Get top 3 matches by score
  const topMatches = [...matches]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-[var(--font-heading)]">
          Welcome back, {currentUser?.name || "there"}!
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Here&apos;s what&apos;s happening with your matches
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Matches"
          value={matches.length}
          icon={Users}
          description="Based on your profile"
        />
        <StatsCard
          title="New This Week"
          value={pendingMatches.length}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Intros Sent"
          value={sentIntros.length}
          icon={Send}
        />
        <StatsCard
          title="Profile Views"
          value={Math.floor(Math.random() * 50) + 10}
          icon={Eye}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Top Matches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Matches</CardTitle>
          <Link href="/dashboard/matches">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-4">
            {topMatches.map((match) => {
              const startup = mockStartups.find((s) => s.id === match.startupId);
              const investor = mockInvestors.find(
                (i) => i.id === match.investorId
              );

              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  startup={startup}
                  investor={investor}
                  viewType={userRole === "startup" ? "startup" : "investor"}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Intros */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Introductions</CardTitle>
          </CardHeader>
          <CardContent>
            {sentIntros.filter((ir) => ir.status === "pending").length === 0 ? (
              <p className="text-[var(--muted)] text-center py-8">
                No pending introductions
              </p>
            ) : (
              <ul className="space-y-4">
                {sentIntros
                  .filter((ir) => ir.status === "pending")
                  .slice(0, 3)
                  .map((intro) => {
                    const match = matches.find((m) => m.id === intro.matchId);
                    const investor = mockInvestors.find(
                      (i) => i.id === match?.investorId
                    );
                    const startup = mockStartups.find(
                      (s) => s.id === match?.startupId
                    );
                    const displayName =
                      userRole === "startup"
                        ? investor?.firmName
                        : startup?.companyName;

                    return (
                      <li
                        key={intro.id}
                        className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                      >
                        <div>
                          <p className="font-medium">{displayName}</p>
                          <p className="text-sm text-[var(--muted)]">
                            Sent{" "}
                            {new Date(intro.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </li>
                    );
                  })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/matches" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-5 w-5 mr-3" />
                Browse New Matches
              </Button>
            </Link>
            <Link href="/dashboard/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-5 w-5 mr-3" />
                Update Your Profile
              </Button>
            </Link>
            <Link href="/dashboard/intros" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-5 w-5 mr-3" />
                Check Introduction Requests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
