import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)]/10 text-[var(--primary)]",
        secondary: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
        success: "bg-[var(--success)]/10 text-[var(--success)]",
        warning: "bg-[var(--warning)]/10 text-[var(--warning)]",
        error: "bg-[var(--error)]/10 text-[var(--error)]",
        outline: "border border-[var(--border)] text-[var(--foreground)]",
        muted: "bg-black/5 text-[var(--muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Sector badge with predefined colors
const sectorColors: Record<string, string> = {
  "ai-ml": "bg-purple-100 text-purple-700",
  fintech: "bg-green-100 text-green-700",
  healthtech: "bg-red-100 text-red-700",
  cleantech: "bg-emerald-100 text-emerald-700",
  saas: "bg-blue-100 text-blue-700",
  consumer: "bg-pink-100 text-pink-700",
  edtech: "bg-yellow-100 text-yellow-700",
  foodtech: "bg-orange-100 text-orange-700",
  agtech: "bg-lime-100 text-lime-700",
  biotech: "bg-cyan-100 text-cyan-700",
  hardware: "bg-slate-100 text-slate-700",
  marketplace: "bg-indigo-100 text-indigo-700",
};

const sectorLabels: Record<string, string> = {
  "ai-ml": "AI/ML",
  fintech: "FinTech",
  healthtech: "HealthTech",
  cleantech: "CleanTech",
  saas: "SaaS",
  consumer: "Consumer",
  edtech: "EdTech",
  foodtech: "FoodTech",
  agtech: "AgTech",
  biotech: "BioTech",
  hardware: "Hardware",
  marketplace: "Marketplace",
};

export function SectorBadge({
  sector,
  className,
}: {
  sector: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium",
        sectorColors[sector] || "bg-gray-100 text-gray-700",
        className
      )}
    >
      {sectorLabels[sector] || sector}
    </span>
  );
}

// Stage badge with predefined colors
const stageColors: Record<string, string> = {
  "pre-seed": "bg-slate-100 text-slate-700",
  seed: "bg-green-100 text-green-700",
  "series-a": "bg-blue-100 text-blue-700",
  "series-b": "bg-purple-100 text-purple-700",
  "series-c": "bg-pink-100 text-pink-700",
  growth: "bg-orange-100 text-orange-700",
};

const stageLabels: Record<string, string> = {
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  "series-c": "Series C",
  growth: "Growth",
};

export function StageBadge({
  stage,
  className,
}: {
  stage: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium",
        stageColors[stage] || "bg-gray-100 text-gray-700",
        className
      )}
    >
      {stageLabels[stage] || stage}
    </span>
  );
}

// Status badge
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  viewed: "bg-blue-100 text-blue-700",
  "intro-requested": "bg-purple-100 text-purple-700",
  connected: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  viewed: "Viewed",
  "intro-requested": "Intro Requested",
  connected: "Connected",
  declined: "Declined",
  accepted: "Accepted",
  expired: "Expired",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium",
        statusColors[status] || "bg-gray-100 text-gray-700",
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export { Badge, badgeVariants };
