"use client";

import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MatchCard, EmptyState } from "@/components/dashboard";
import { useAppStore } from "@/stores/app-store";
import { mockStartups, mockInvestors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const filterOptions = [
  { value: "all", label: "All Matches" },
  { value: "80+", label: "80%+ Match" },
  { value: "pending", label: "Pending" },
  { value: "intro-requested", label: "Intro Requested" },
];

export default function MatchesPage() {
  const { matches, userRole } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"score" | "recent">("score");

  // Filter and sort matches
  let filteredMatches = [...matches];

  // Apply search
  if (searchQuery) {
    filteredMatches = filteredMatches.filter((match) => {
      const startup = mockStartups.find((s) => s.id === match.startupId);
      const investor = mockInvestors.find((i) => i.id === match.investorId);
      const searchTarget =
        userRole === "startup"
          ? investor?.firmName.toLowerCase()
          : startup?.companyName.toLowerCase();
      return searchTarget?.includes(searchQuery.toLowerCase());
    });
  }

  // Apply filter
  switch (activeFilter) {
    case "80+":
      filteredMatches = filteredMatches.filter((m) => m.score >= 80);
      break;
    case "pending":
      filteredMatches = filteredMatches.filter((m) => m.status === "pending");
      break;
    case "intro-requested":
      filteredMatches = filteredMatches.filter(
        (m) => m.status === "intro-requested"
      );
      break;
  }

  // Apply sort
  if (sortBy === "score") {
    filteredMatches.sort((a, b) => b.score - a.score);
  } else {
    filteredMatches.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-[var(--font-heading)]">Your Matches</h1>
        <p className="text-[var(--muted)] mt-1">
          {userRole === "startup"
            ? "Investors who match your profile and funding needs"
            : "Startups that align with your investment criteria"}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
          <Input
            placeholder={`Search ${
              userRole === "startup" ? "investors" : "startups"
            }...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "score" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSortBy("score")}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Best Match
          </Button>
          <Button
            variant={sortBy === "recent" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
          >
            Most Recent
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeFilter === filter.value
                ? "bg-[var(--primary)] text-white"
                : "bg-white border border-[var(--border)] text-[var(--muted)] hover:bg-gray-50"
            )}
          >
            {filter.label}
            {filter.value === "all" && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {matches.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Match Grid */}
      {filteredMatches.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No matches found"
          description="Try adjusting your filters or search query to find more matches."
          action={{
            label: "Clear Filters",
            onClick: () => {
              setSearchQuery("");
              setActiveFilter("all");
            },
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMatches.map((match) => {
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
      )}
    </div>
  );
}
