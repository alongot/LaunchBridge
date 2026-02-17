export type UserRole = "startup" | "investor";

export type FundingStage =
  | "pre-seed"
  | "seed"
  | "series-a"
  | "series-b"
  | "series-c"
  | "growth";

export type Sector =
  | "ai-ml"
  | "fintech"
  | "healthtech"
  | "cleantech"
  | "saas"
  | "consumer"
  | "edtech"
  | "foodtech"
  | "agtech"
  | "biotech"
  | "hardware"
  | "marketplace";

export type MatchStatus = "pending" | "viewed" | "intro-requested" | "connected" | "declined";

export type IntroStatus = "pending" | "accepted" | "declined" | "expired";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  onboardingComplete: boolean;
}

export interface Startup {
  id: string;
  profileId: string;
  companyName: string;
  tagline: string;
  description: string;
  website?: string;
  logoUrl?: string;
  foundedYear: number;
  teamSize: number;
  location: string;
  sector: Sector;
  stage: FundingStage;
  fundingTarget: number;
  fundingRaised: number;
  pitchDeckUrl?: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Investor {
  id: string;
  profileId: string;
  firmName: string;
  title: string;
  bio: string;
  website?: string;
  logoUrl?: string;
  location: string;
  investorType: "angel" | "vc" | "family-office" | "corporate";
  checkSizeMin: number;
  checkSizeMax: number;
  preferredStages: FundingStage[];
  preferredSectors: Sector[];
  portfolioCount: number;
  thesis: string;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  startupId: string;
  investorId: string;
  score: number;
  scoreBreakdown: {
    stageAlignment: number;
    sectorMatch: number;
    checkSizeFit: number;
    locationBonus: number;
  };
  status: MatchStatus;
  createdAt: string;
  viewedAt?: string;
}

export interface IntroRequest {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: IntroStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Form types
export interface StartupOnboardingData {
  // Step 1: Basics
  companyName: string;
  tagline: string;
  description: string;
  website?: string;
  foundedYear: number;
  teamSize: number;
  location: string;

  // Step 2: Industry & Stage
  sector: Sector;
  stage: FundingStage;

  // Step 3: Funding
  fundingTarget: number;
  fundingRaised: number;
  highlights: string[];

  // Step 4: Deck
  pitchDeckUrl?: string;
}

export interface InvestorOnboardingData {
  // Step 1: Profile
  firmName: string;
  title: string;
  bio: string;
  website?: string;
  location: string;
  investorType: "angel" | "vc" | "family-office" | "corporate";

  // Step 2: Criteria
  checkSizeMin: number;
  checkSizeMax: number;
  preferredStages: FundingStage[];
  preferredSectors: Sector[];

  // Step 3: Thesis
  thesis: string;
  portfolioCount: number;
}

// UI helper types
export interface SelectOption {
  value: string;
  label: string;
}

export const STAGE_OPTIONS: SelectOption[] = [
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B" },
  { value: "series-c", label: "Series C" },
  { value: "growth", label: "Growth" },
];

export const SECTOR_OPTIONS: SelectOption[] = [
  { value: "ai-ml", label: "AI / Machine Learning" },
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "cleantech", label: "CleanTech" },
  { value: "saas", label: "SaaS" },
  { value: "consumer", label: "Consumer" },
  { value: "edtech", label: "EdTech" },
  { value: "foodtech", label: "FoodTech" },
  { value: "agtech", label: "AgTech" },
  { value: "biotech", label: "BioTech" },
  { value: "hardware", label: "Hardware" },
  { value: "marketplace", label: "Marketplace" },
];

export const INVESTOR_TYPE_OPTIONS: SelectOption[] = [
  { value: "angel", label: "Angel Investor" },
  { value: "vc", label: "Venture Capital" },
  { value: "family-office", label: "Family Office" },
  { value: "corporate", label: "Corporate VC" },
];
