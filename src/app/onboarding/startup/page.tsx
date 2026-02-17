"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Waves, ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding";
import {
  startupBasicsSchema,
  startupIndustrySchema,
  startupFundingSchema,
  startupDeckSchema,
  type StartupBasicsFormData,
  type StartupIndustryFormData,
  type StartupFundingFormData,
  type StartupDeckFormData,
} from "@/lib/validations";
import { STAGE_OPTIONS, SECTOR_OPTIONS } from "@/types";
import { useAppStore } from "@/stores/app-store";

const steps = [
  { title: "Basics", description: "Company info" },
  { title: "Industry", description: "Sector & stage" },
  { title: "Funding", description: "Goals & traction" },
  { title: "Deck", description: "Pitch materials" },
];

export default function StartupOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateStartupOnboarding, completeOnboarding, startupOnboarding } =
    useAppStore();

  // Step 1: Basics
  const basicsForm = useForm<StartupBasicsFormData>({
    resolver: zodResolver(startupBasicsSchema),
    defaultValues: {
      companyName: startupOnboarding.companyName || "",
      tagline: startupOnboarding.tagline || "",
      description: startupOnboarding.description || "",
      website: startupOnboarding.website || "",
      foundedYear: startupOnboarding.foundedYear || new Date().getFullYear(),
      teamSize: startupOnboarding.teamSize || 1,
      location: startupOnboarding.location || "San Francisco, CA",
    },
  });

  // Step 2: Industry
  const industryForm = useForm<StartupIndustryFormData>({
    resolver: zodResolver(startupIndustrySchema),
    defaultValues: {
      sector: startupOnboarding.sector,
      stage: startupOnboarding.stage,
    },
  });

  // Step 3: Funding
  const fundingForm = useForm<StartupFundingFormData>({
    resolver: zodResolver(startupFundingSchema),
    defaultValues: {
      fundingTarget: startupOnboarding.fundingTarget || 500000,
      fundingRaised: startupOnboarding.fundingRaised || 0,
      highlights: startupOnboarding.highlights || [""],
    },
  });

  // Step 4: Deck
  const deckForm = useForm<StartupDeckFormData>({
    resolver: zodResolver(startupDeckSchema),
    defaultValues: {
      pitchDeckUrl: startupOnboarding.pitchDeckUrl || "",
    },
  });

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await basicsForm.trigger();
        if (isValid) {
          updateStartupOnboarding(basicsForm.getValues());
        }
        break;
      case 1:
        isValid = await industryForm.trigger();
        if (isValid) {
          updateStartupOnboarding(industryForm.getValues());
        }
        break;
      case 2:
        isValid = await fundingForm.trigger();
        if (isValid) {
          updateStartupOnboarding(fundingForm.getValues());
        }
        break;
      case 3:
        isValid = await deckForm.trigger();
        if (isValid) {
          updateStartupOnboarding(deckForm.getValues());
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

  const [highlights, setHighlights] = useState<string[]>(
    startupOnboarding.highlights?.length ? startupOnboarding.highlights : [""]
  );

  const addHighlight = () => {
    if (highlights.length < 5) {
      setHighlights([...highlights, ""]);
    }
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
    fundingForm.setValue("highlights", newHighlights.filter((h) => h.trim()));
  };

  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
    fundingForm.setValue("highlights", newHighlights.filter((h) => h.trim()));
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
            {/* Step 1: Basics */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    Tell us about your startup
                  </h2>
                  <p className="text-[var(--muted)]">
                    Basic information about your company
                  </p>
                </div>

                <Input
                  label="Company Name"
                  placeholder="Your startup name"
                  error={basicsForm.formState.errors.companyName?.message}
                  {...basicsForm.register("companyName")}
                />

                <Input
                  label="Tagline"
                  placeholder="One line that describes what you do"
                  error={basicsForm.formState.errors.tagline?.message}
                  {...basicsForm.register("tagline")}
                />

                <Textarea
                  label="Description"
                  placeholder="Tell investors about your product, market, and vision..."
                  error={basicsForm.formState.errors.description?.message}
                  {...basicsForm.register("description")}
                />

                <Input
                  label="Website (optional)"
                  placeholder="https://yourcompany.com"
                  error={basicsForm.formState.errors.website?.message}
                  {...basicsForm.register("website")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Founded Year"
                    type="number"
                    placeholder="2023"
                    error={basicsForm.formState.errors.foundedYear?.message}
                    {...basicsForm.register("foundedYear", { valueAsNumber: true })}
                  />

                  <Input
                    label="Team Size"
                    type="number"
                    placeholder="5"
                    error={basicsForm.formState.errors.teamSize?.message}
                    {...basicsForm.register("teamSize", { valueAsNumber: true })}
                  />
                </div>

                <Input
                  label="Location"
                  placeholder="San Francisco, CA"
                  error={basicsForm.formState.errors.location?.message}
                  {...basicsForm.register("location")}
                />
              </div>
            )}

            {/* Step 2: Industry */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    Industry & Stage
                  </h2>
                  <p className="text-[var(--muted)]">
                    Help us match you with the right investors
                  </p>
                </div>

                <Select
                  label="Sector"
                  options={SECTOR_OPTIONS}
                  placeholder="Select your primary sector"
                  error={industryForm.formState.errors.sector?.message}
                  {...industryForm.register("sector")}
                />

                <Select
                  label="Funding Stage"
                  options={STAGE_OPTIONS}
                  placeholder="Select your current stage"
                  error={industryForm.formState.errors.stage?.message}
                  {...industryForm.register("stage")}
                />
              </div>
            )}

            {/* Step 3: Funding */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    Funding Details
                  </h2>
                  <p className="text-[var(--muted)]">
                    Share your funding goals and traction
                  </p>
                </div>

                <Input
                  label="Funding Target ($)"
                  type="number"
                  placeholder="500000"
                  error={fundingForm.formState.errors.fundingTarget?.message}
                  {...fundingForm.register("fundingTarget", { valueAsNumber: true })}
                />

                <Input
                  label="Amount Already Raised ($)"
                  type="number"
                  placeholder="0"
                  error={fundingForm.formState.errors.fundingRaised?.message}
                  {...fundingForm.register("fundingRaised", { valueAsNumber: true })}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Key Highlights
                  </label>
                  <p className="text-sm text-[var(--muted)] mb-3">
                    Share your top achievements, metrics, or milestones
                  </p>
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="e.g., $100K MRR, 10K users, Partnership with..."
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                      />
                      {highlights.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHighlight(index)}
                        >
                          &times;
                        </Button>
                      )}
                    </div>
                  ))}
                  {highlights.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addHighlight}
                    >
                      + Add Highlight
                    </Button>
                  )}
                  {fundingForm.formState.errors.highlights && (
                    <p className="mt-2 text-sm text-[var(--error)]">
                      {fundingForm.formState.errors.highlights.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Deck */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] mb-2">
                    Pitch Deck
                  </h2>
                  <p className="text-[var(--muted)]">
                    Share your pitch deck (optional but recommended)
                  </p>
                </div>

                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
                  <Upload className="h-12 w-12 text-[var(--muted)] mx-auto mb-4" />
                  <p className="text-[var(--muted)] mb-2">
                    Drag and drop your pitch deck, or
                  </p>
                  <Button variant="outline" type="button">
                    Browse Files
                  </Button>
                  <p className="text-xs text-[var(--muted)] mt-4">
                    PDF, PPT, or PPTX up to 25MB
                  </p>
                </div>

                <div className="text-center text-[var(--muted)]">or</div>

                <Input
                  label="Link to Deck"
                  placeholder="https://docsend.com/your-deck or Google Drive link"
                  error={deckForm.formState.errors.pitchDeckUrl?.message}
                  {...deckForm.register("pitchDeckUrl")}
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
