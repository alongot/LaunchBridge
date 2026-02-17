"use client";

import { useState } from "react";
import { MapPin, ExternalLink, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { SectorBadge, StageBadge, StatusBadge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/input";
import { ScoreRing } from "./score-ring";
import { formatCurrency } from "@/lib/utils";
import type { Match, Startup, Investor } from "@/types";
import { useAppStore } from "@/stores/app-store";

interface MatchCardProps {
  match: Match;
  startup?: Startup;
  investor?: Investor;
  viewType: "startup" | "investor";
}

export function MatchCard({ match, startup, investor, viewType }: MatchCardProps) {
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [introMessage, setIntroMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestIntro } = useAppStore();

  // Determine what to display based on view type
  const displayName = viewType === "startup" ? investor?.firmName : startup?.companyName;
  const displayTagline = viewType === "startup" ? investor?.title : startup?.tagline;
  const displayLocation = viewType === "startup" ? investor?.location : startup?.location;
  const displaySector = startup?.sector;
  const displayStage = startup?.stage;
  const checkSize = investor
    ? `${formatCurrency(investor.checkSizeMin)} - ${formatCurrency(investor.checkSizeMax)}`
    : null;

  const handleRequestIntro = async () => {
    if (!introMessage.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    requestIntro(match.id, introMessage);
    setIsSubmitting(false);
    setShowIntroModal(false);
    setIntroMessage("");
  };

  const canRequestIntro = match.status === "pending" || match.status === "viewed";

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar name={displayName} size="lg" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg truncate">{displayName}</h3>
                  <p className="text-sm text-[var(--muted)] truncate">
                    {displayTagline}
                  </p>
                </div>
                <ScoreRing score={match.score} size="sm" />
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 mt-2 text-sm text-[var(--muted)]">
                <MapPin className="h-4 w-4" />
                <span>{displayLocation}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {displaySector && <SectorBadge sector={displaySector} />}
                {displayStage && <StageBadge stage={displayStage} />}
                {checkSize && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                    {checkSize}
                  </span>
                )}
              </div>

              {/* Status or Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                <StatusBadge status={match.status} />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" rounded="default">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {canRequestIntro && (
                    <Button size="sm" onClick={() => setShowIntroModal(true)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Request Intro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intro Request Modal */}
      <Modal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        title="Request Introduction"
        description={`Send an introduction request to ${displayName}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-[var(--primary)]/5 rounded-lg p-4">
            <h4 className="font-medium mb-2">Match Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Stage Alignment</span>
                <span className="font-medium">{match.scoreBreakdown.stageAlignment}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Sector Match</span>
                <span className="font-medium">{match.scoreBreakdown.sectorMatch}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Check Size Fit</span>
                <span className="font-medium">{match.scoreBreakdown.checkSizeFit}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Location Bonus</span>
                <span className="font-medium">{match.scoreBreakdown.locationBonus}%</span>
              </div>
            </div>
          </div>

          <Textarea
            label="Your Message"
            placeholder="Introduce yourself and explain why you'd like to connect..."
            value={introMessage}
            onChange={(e) => setIntroMessage(e.target.value)}
            helperText="Tip: Personalize your message to increase your chances of a response."
          />

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setShowIntroModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestIntro}
              isLoading={isSubmitting}
              disabled={introMessage.length < 50}
            >
              Send Request
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
}
