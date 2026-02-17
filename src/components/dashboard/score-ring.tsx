"use client";

import { getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeConfig = {
  sm: {
    width: 48,
    strokeWidth: 4,
    fontSize: "text-xs",
  },
  md: {
    width: 64,
    strokeWidth: 5,
    fontSize: "text-sm",
  },
  lg: {
    width: 80,
    strokeWidth: 6,
    fontSize: "text-base",
  },
};

export function ScoreRing({ score, size = "md", showLabel = true }: ScoreRingProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold ${config.fontSize}`} style={{ color }}>
            {score}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-[var(--muted)]">Match</span>
      )}
    </div>
  );
}
