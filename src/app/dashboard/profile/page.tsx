"use client";

import { useState } from "react";
import { Edit2, Save, MapPin, Globe, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { SectorBadge, StageBadge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/app-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const { currentUser, userRole, startup, investor } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  if (userRole === "startup" && startup) {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-[var(--font-heading)]">Your Profile</h1>
            <p className="text-[var(--muted)] mt-1">
              This is how investors see your startup
            </p>
          </div>
          <Button
            variant={isEditing ? "primary" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Avatar name={startup.companyName} size="xl" />
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    defaultValue={startup.companyName}
                    className="text-2xl font-semibold mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold mb-1">
                    {startup.companyName}
                  </h2>
                )}
                {isEditing ? (
                  <Input
                    defaultValue={startup.tagline}
                    className="text-[var(--muted)]"
                  />
                ) : (
                  <p className="text-[var(--muted)]">{startup.tagline}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <SectorBadge sector={startup.sector} />
                  <StageBadge stage={startup.stage} />
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {startup.location}
                  </span>
                  {startup.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {startup.website}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Founded {startup.foundedYear}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {startup.teamSize} team members
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                defaultValue={startup.description}
                className="min-h-[150px]"
              />
            ) : (
              <p className="text-[var(--foreground)]">{startup.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Funding */}
        <Card>
          <CardHeader>
            <CardTitle>Funding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Raising</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(startup.fundingTarget)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Already Raised</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(startup.fundingRaised)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--muted)]">Progress</span>
                <span className="font-medium">
                  {Math.round(
                    (startup.fundingRaised / startup.fundingTarget) * 100
                  )}
                  %
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (startup.fundingRaised / startup.fundingTarget) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {startup.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  {isEditing ? (
                    <Input defaultValue={highlight} className="flex-1" />
                  ) : (
                    <span>{highlight}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === "investor" && investor) {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-[var(--font-heading)]">Your Profile</h1>
            <p className="text-[var(--muted)] mt-1">
              This is how startups see you
            </p>
          </div>
          <Button
            variant={isEditing ? "primary" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Avatar name={investor.firmName} size="xl" />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">
                  {investor.firmName}
                </h2>
                <p className="text-[var(--muted)]">{investor.title}</p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {investor.location}
                  </span>
                  {investor.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {investor.website}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                defaultValue={investor.bio}
                className="min-h-[150px]"
              />
            ) : (
              <p className="text-[var(--foreground)]">{investor.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Investment Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Check Size</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(investor.checkSizeMin)} -{" "}
                  {formatCurrency(investor.checkSizeMax)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">
                  Portfolio Companies
                </p>
                <p className="text-xl font-semibold">{investor.portfolioCount}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)] mb-2">Preferred Stages</p>
              <div className="flex flex-wrap gap-2">
                {investor.preferredStages.map((stage) => (
                  <StageBadge key={stage} stage={stage} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)] mb-2">Preferred Sectors</p>
              <div className="flex flex-wrap gap-2">
                {investor.preferredSectors.map((sector) => (
                  <SectorBadge key={sector} sector={sector} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thesis */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Thesis</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                defaultValue={investor.thesis}
                className="min-h-[150px]"
              />
            ) : (
              <p className="text-[var(--foreground)]">{investor.thesis}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback for users without complete profile
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-[var(--font-heading)]">Your Profile</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-[var(--muted)]">
            Complete your onboarding to set up your profile.
          </p>
          <Button className="mt-4">Complete Onboarding</Button>
        </CardContent>
      </Card>
    </div>
  );
}
