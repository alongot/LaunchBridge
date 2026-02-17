"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Waves, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding";
import {
  investorProfileSchema,
  investorCriteriaSchema,
  investorThesisSchema,
  type InvestorProfileFormData,
  type InvestorCriteriaFormData,
  type InvestorThesisFormData,
} from "@/lib/validations";
import { STAGE_OPTIONS, SECTOR_OPTIONS, INVESTOR_TYPE_OPTIONS } from "@/types";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Profile", description: "About you" },
  { title: "Criteria", description: "Investment preferences" },
  { title: "Thesis", description: "Your focus" },
];

export default function InvestorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateInvestorOnboarding, completeOnboarding, investorOnboarding } =
    useAppStore();

  // Step 1: Profile
  const profileForm = useForm<InvestorProfileFormData>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues: {
      firmName: investorOnboarding.firmName || "",
      title: investorOnboarding.title || "",
      bio: investorOnboarding.bio || "",
      website: investorOnboarding.website || "",
      location: investorOnboarding.location || "San Francisco, CA",
      investorType: investorOnboarding.investorType,
    },
  });

  // Step 2: Criteria
  const criteriaForm = useForm<InvestorCriteriaFormData>({
    resolver: zodResolver(investorCriteriaSchema),
    defaultValues: {
      checkSizeMin: investorOnboarding.checkSizeMin || 25000,
      checkSizeMax: investorOnboarding.checkSizeMax || 250000,
      preferredStages: investorOnboarding.preferredStages || [],
      preferredSectors: investorOnboarding.preferredSectors || [],
    },
  });

  // Step 3: Thesis
  const thesisForm = useForm<InvestorThesisFormData>({
    resolver: zodResolver(investorThesisSchema),
    defaultValues: {
      thesis: investorOnboarding.thesis || "",
      portfolioCount: investorOnboarding.portfolioCount || 0,
    },
  });

  const [selectedStages, setSelectedStages] = useState<string[]>(
    investorOnboarding.preferredStages || []
  );
  const [selectedSectors, setSelectedSectors] = useState<string[]>(
    investorOnboarding.preferredSectors || []
  );

  const toggleStage = (stage: string) => {
    const newStages = selectedStages.includes(stage)
      ? selectedStages.filter((s) => s !== stage)
      : [...selectedStages, stage];
    setSelectedStages(newStages);
    criteriaForm.setValue("preferredStages", newStages as InvestorCriteriaFormData["preferredStages"]);
  };

  const toggleSector = (sector: string) => {
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];
    setSelectedSectors(newSectors);
    criteriaForm.setValue("preferredSectors", newSectors as InvestorCriteriaFormData["preferredSectors"]);
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await profileForm.trigger();
        if (isValid) {
          updateInvestorOnboarding(profileForm.getValues());
        }
        break;
      case 1:
        isValid = await criteriaForm.trigger();
        if (isValid) {
          updateInvestorOnboarding(criteriaForm.getValues());
        }
        break;
      case 2:
        isValid = await thesisForm.trigger();
        if (isValid) {
          updateInvestorOnboarding(thesisForm.getValues());
          await handleComplete();
          return;
        }
        break;
    }

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    completeOnboarding();
    toast.success("Profile created! Finding your matches...");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Waves className="h-8 w-8 text-[var(--primary)]" />
          <span className="text-xl font-semibold">LaunchBridge</span>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} className="mb-8" />

        {/* Form Card */}
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Profile */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    About You
                  </h2>
                  <p className="text-[var(--muted)]">
                    Tell startups who you are
                  </p>
                </div>

                <Input
                  label="Firm / Fund Name"
                  placeholder="Your firm or investment entity name"
                  error={profileForm.formState.errors.firmName?.message}
                  {...profileForm.register("firmName")}
                />

                <Input
                  label="Your Title"
                  placeholder="e.g., Partner, Angel Investor, Principal"
                  error={profileForm.formState.errors.title?.message}
                  {...profileForm.register("title")}
                />

                <Select
                  label="Investor Type"
                  options={INVESTOR_TYPE_OPTIONS}
                  placeholder="Select your investor type"
                  error={profileForm.formState.errors.investorType?.message}
                  {...profileForm.register("investorType")}
                />

                <Textarea
                  label="Bio"
                  placeholder="Share your background, experience, and what makes you a great partner for founders..."
                  error={profileForm.formState.errors.bio?.message}
                  {...profileForm.register("bio")}
                />

                <Input
                  label="Website (optional)"
                  placeholder="https://yourfirm.com"
                  error={profileForm.formState.errors.website?.message}
                  {...profileForm.register("website")}
                />

                <Input
                  label="Location"
                  placeholder="San Francisco, CA"
                  error={profileForm.formState.errors.location?.message}
                  {...profileForm.register("location")}
                />
              </div>
            )}

            {/* Step 2: Criteria */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    Investment Criteria
                  </h2>
                  <p className="text-[var(--muted)]">
                    Define what you&apos;re looking for
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Check Size ($)"
                    type="number"
                    placeholder="25000"
                    error={criteriaForm.formState.errors.checkSizeMin?.message}
                    {...criteriaForm.register("checkSizeMin", {
                      valueAsNumber: true,
                    })}
                  />

                  <Input
                    label="Max Check Size ($)"
                    type="number"
                    placeholder="250000"
                    error={criteriaForm.formState.errors.checkSizeMax?.message}
                    {...criteriaForm.register("checkSizeMax", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Preferred Stages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STAGE_OPTIONS.map((stage) => (
                      <button
                        key={stage.value}
                        type="button"
                        onClick={() => toggleStage(stage.value)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                          selectedStages.includes(stage.value)
                            ? "bg-[var(--primary)] text-white"
                            : "bg-gray-100 text-[var(--muted)] hover:bg-gray-200"
                        )}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                  {criteriaForm.formState.errors.preferredStages && (
                    <p className="mt-2 text-sm text-[var(--error)]">
                      {criteriaForm.formState.errors.preferredStages.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Preferred Sectors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SECTOR_OPTIONS.map((sector) => (
                      <button
                        key={sector.value}
                        type="button"
                        onClick={() => toggleSector(sector.value)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                          selectedSectors.includes(sector.value)
                            ? "bg-[var(--secondary)] text-white"
                            : "bg-gray-100 text-[var(--muted)] hover:bg-gray-200"
                        )}
                      >
                        {sector.label}
                      </button>
                    ))}
                  </div>
                  {criteriaForm.formState.errors.preferredSectors && (
                    <p className="mt-2 text-sm text-[var(--error)]">
                      {criteriaForm.formState.errors.preferredSectors.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Thesis */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    Investment Thesis
                  </h2>
                  <p className="text-[var(--muted)]">
                    Share what gets you excited about investing
                  </p>
                </div>

                <Textarea
                  label="Investment Thesis"
                  placeholder="What types of companies are you looking to invest in? What problems do you want to help solve? What makes a founder stand out to you?"
                  className="min-h-[200px]"
                  error={thesisForm.formState.errors.thesis?.message}
                  {...thesisForm.register("thesis")}
                />

                <Input
                  label="Portfolio Companies"
                  type="number"
                  placeholder="0"
                  helperText="How many companies have you invested in?"
                  error={thesisForm.formState.errors.portfolioCount?.message}
                  {...thesisForm.register("portfolioCount", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Button
                type="button"
                onClick={handleNext}
                isLoading={isSubmitting}
              >
                {currentStep === steps.length - 1 ? (
                  "Complete Setup"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
