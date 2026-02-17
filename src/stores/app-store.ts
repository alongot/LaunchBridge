import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Profile,
  Startup,
  Investor,
  Match,
  IntroRequest,
  UserRole,
  StartupOnboardingData,
  InvestorOnboardingData,
} from "@/types";
import {
  mockProfiles,
  mockStartups,
  mockInvestors,
  mockMatches,
  mockIntroRequests,
  demoStartupUser,
  demoInvestorUser,
} from "@/lib/mock-data";

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  currentUser: Profile | null;
  userRole: UserRole | null;

  // Entity data
  startup: Startup | null;
  investor: Investor | null;
  matches: Match[];
  introRequests: IntroRequest[];

  // All data (for demo)
  allStartups: Startup[];
  allInvestors: Investor[];

  // Onboarding state
  onboardingStep: number;
  startupOnboarding: Partial<StartupOnboardingData>;
  investorOnboarding: Partial<InvestorOnboardingData>;

  // UI state
  sidebarOpen: boolean;
  selectedMatchId: string | null;

  // Actions
  setAuth: (profile: Profile | null) => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  setOnboardingStep: (step: number) => void;
  updateStartupOnboarding: (data: Partial<StartupOnboardingData>) => void;
  updateInvestorOnboarding: (data: Partial<InvestorOnboardingData>) => void;
  completeOnboarding: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedMatch: (matchId: string | null) => void;
  requestIntro: (matchId: string, message: string) => void;
  updateMatchStatus: (matchId: string, status: Match["status"]) => void;

  // Demo actions
  loginAsDemo: (role: UserRole) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentUser: null,
      userRole: null,
      startup: null,
      investor: null,
      matches: [],
      introRequests: [],
      allStartups: mockStartups,
      allInvestors: mockInvestors,
      onboardingStep: 1,
      startupOnboarding: {},
      investorOnboarding: {},
      sidebarOpen: true,
      selectedMatchId: null,

      // Actions
      setAuth: (profile) => {
        if (profile) {
          const matches =
            profile.role === "startup"
              ? mockMatches.filter((m) =>
                  mockStartups.find(
                    (s) => s.profileId === profile.id && s.id === m.startupId
                  )
                )
              : mockMatches.filter((m) =>
                  mockInvestors.find(
                    (i) => i.profileId === profile.id && i.id === m.investorId
                  )
                );

          const introRequests = mockIntroRequests.filter(
            (ir) => ir.senderId === profile.id || ir.receiverId === profile.id
          );

          set({
            isAuthenticated: true,
            currentUser: profile,
            userRole: profile.role,
            matches,
            introRequests,
          });
        } else {
          set({
            isAuthenticated: false,
            currentUser: null,
            userRole: null,
            startup: null,
            investor: null,
            matches: [],
            introRequests: [],
          });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          userRole: null,
          startup: null,
          investor: null,
          matches: [],
          introRequests: [],
          onboardingStep: 1,
          startupOnboarding: {},
          investorOnboarding: {},
        });
      },

      setUserRole: (role) => {
        set({ userRole: role });
      },

      setOnboardingStep: (step) => {
        set({ onboardingStep: step });
      },

      updateStartupOnboarding: (data) => {
        set((state) => ({
          startupOnboarding: { ...state.startupOnboarding, ...data },
        }));
      },

      updateInvestorOnboarding: (data) => {
        set((state) => ({
          investorOnboarding: { ...state.investorOnboarding, ...data },
        }));
      },

      completeOnboarding: () => {
        const { currentUser, userRole, startupOnboarding, investorOnboarding } =
          get();

        if (!currentUser) return;

        if (userRole === "startup") {
          const newStartup: Startup = {
            id: `startup-new-${Date.now()}`,
            profileId: currentUser.id,
            companyName: startupOnboarding.companyName || "",
            tagline: startupOnboarding.tagline || "",
            description: startupOnboarding.description || "",
            website: startupOnboarding.website,
            logoUrl: undefined,
            foundedYear: startupOnboarding.foundedYear || new Date().getFullYear(),
            teamSize: startupOnboarding.teamSize || 1,
            location: startupOnboarding.location || "",
            sector: startupOnboarding.sector || "saas",
            stage: startupOnboarding.stage || "pre-seed",
            fundingTarget: startupOnboarding.fundingTarget || 0,
            fundingRaised: startupOnboarding.fundingRaised || 0,
            pitchDeckUrl: startupOnboarding.pitchDeckUrl,
            highlights: startupOnboarding.highlights || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            startup: newStartup,
            currentUser: { ...currentUser, onboardingComplete: true },
            // Generate some matches for the new startup
            matches: mockInvestors.slice(0, 3).map((inv, i) => ({
              id: `match-new-${i}`,
              startupId: newStartup.id,
              investorId: inv.id,
              score: 70 + Math.floor(Math.random() * 25),
              scoreBreakdown: {
                stageAlignment: 20 + Math.floor(Math.random() * 5),
                sectorMatch: 20 + Math.floor(Math.random() * 10),
                checkSizeFit: 15 + Math.floor(Math.random() * 10),
                locationBonus: 15,
              },
              status: "pending",
              createdAt: new Date().toISOString(),
            })),
          });
        } else {
          const newInvestor: Investor = {
            id: `investor-new-${Date.now()}`,
            profileId: currentUser.id,
            firmName: investorOnboarding.firmName || "",
            title: investorOnboarding.title || "",
            bio: investorOnboarding.bio || "",
            website: investorOnboarding.website,
            logoUrl: undefined,
            location: investorOnboarding.location || "",
            investorType: investorOnboarding.investorType || "angel",
            checkSizeMin: investorOnboarding.checkSizeMin || 25000,
            checkSizeMax: investorOnboarding.checkSizeMax || 100000,
            preferredStages: investorOnboarding.preferredStages || ["seed"],
            preferredSectors: investorOnboarding.preferredSectors || ["saas"],
            portfolioCount: investorOnboarding.portfolioCount || 0,
            thesis: investorOnboarding.thesis || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            investor: newInvestor,
            currentUser: { ...currentUser, onboardingComplete: true },
            // Generate some matches for the new investor
            matches: mockStartups.slice(0, 5).map((startup, i) => ({
              id: `match-new-${i}`,
              startupId: startup.id,
              investorId: newInvestor.id,
              score: 65 + Math.floor(Math.random() * 30),
              scoreBreakdown: {
                stageAlignment: 18 + Math.floor(Math.random() * 7),
                sectorMatch: 20 + Math.floor(Math.random() * 10),
                checkSizeFit: 15 + Math.floor(Math.random() * 10),
                locationBonus: 15,
              },
              status: "pending",
              createdAt: new Date().toISOString(),
            })),
          });
        }
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setSelectedMatch: (matchId) => {
        set({ selectedMatchId: matchId });
      },

      requestIntro: (matchId, message) => {
        const { currentUser, matches, introRequests } = get();
        if (!currentUser) return;

        const match = matches.find((m) => m.id === matchId);
        if (!match) return;

        const newRequest: IntroRequest = {
          id: `intro-${Date.now()}`,
          matchId,
          senderId: currentUser.id,
          receiverId:
            currentUser.role === "startup"
              ? mockInvestors.find((i) => i.id === match.investorId)?.profileId || ""
              : mockStartups.find((s) => s.id === match.startupId)?.profileId || "",
          message,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        set({
          introRequests: [...introRequests, newRequest],
          matches: matches.map((m) =>
            m.id === matchId ? { ...m, status: "intro-requested" as const } : m
          ),
        });
      },

      updateMatchStatus: (matchId, status) => {
        set((state) => ({
          matches: state.matches.map((m) =>
            m.id === matchId ? { ...m, status } : m
          ),
        }));
      },

      // Demo login
      loginAsDemo: (role) => {
        if (role === "startup") {
          const matches = mockMatches.filter(
            (m) => m.startupId === demoStartupUser.startup.id
          );
          set({
            isAuthenticated: true,
            currentUser: demoStartupUser.profile,
            userRole: "startup",
            startup: demoStartupUser.startup,
            matches,
            introRequests: mockIntroRequests.filter(
              (ir) =>
                ir.senderId === demoStartupUser.profile.id ||
                ir.receiverId === demoStartupUser.profile.id
            ),
          });
        } else {
          const matches = mockMatches.filter(
            (m) => m.investorId === demoInvestorUser.investor.id
          );
          set({
            isAuthenticated: true,
            currentUser: demoInvestorUser.profile,
            userRole: "investor",
            investor: demoInvestorUser.investor,
            matches,
            introRequests: mockIntroRequests.filter(
              (ir) =>
                ir.senderId === demoInvestorUser.profile.id ||
                ir.receiverId === demoInvestorUser.profile.id
            ),
          });
        }
      },
    }),
    {
      name: "launchbridge-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        userRole: state.userRole,
        startup: state.startup,
        investor: state.investor,
      }),
    }
  )
);
