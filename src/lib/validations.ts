import { z } from "zod";

export const emailSchema = z.string().email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["startup", "investor"], {
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const startupBasicsSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(100, "Tagline must be less than 100 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must be less than 1000 characters"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  foundedYear: z
    .number()
    .min(2000, "Founded year must be 2000 or later")
    .max(new Date().getFullYear(), "Founded year cannot be in the future"),
  teamSize: z.number().min(1, "Team size must be at least 1").max(10000),
  location: z.string().min(2, "Location is required"),
});

export const startupIndustrySchema = z.object({
  sector: z.enum([
    "ai-ml",
    "fintech",
    "healthtech",
    "cleantech",
    "saas",
    "consumer",
    "edtech",
    "foodtech",
    "agtech",
    "biotech",
    "hardware",
    "marketplace",
  ]),
  stage: z.enum([
    "pre-seed",
    "seed",
    "series-a",
    "series-b",
    "series-c",
    "growth",
  ]),
});

export const startupFundingSchema = z.object({
  fundingTarget: z.number().min(10000, "Funding target must be at least $10,000"),
  fundingRaised: z.number().min(0, "Funding raised cannot be negative"),
  highlights: z
    .array(z.string().min(10, "Each highlight must be at least 10 characters"))
    .min(1, "Please add at least one highlight")
    .max(5, "Maximum 5 highlights"),
});

export const startupDeckSchema = z.object({
  pitchDeckUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const investorProfileSchema = z.object({
  firmName: z.string().min(2, "Firm name must be at least 2 characters"),
  title: z.string().min(2, "Title is required"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must be less than 500 characters"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  investorType: z.enum(["angel", "vc", "family-office", "corporate"]),
});

export const investorCriteriaSchema = z.object({
  checkSizeMin: z.number().min(1000, "Minimum check size must be at least $1,000"),
  checkSizeMax: z.number().min(1000, "Maximum check size must be at least $1,000"),
  preferredStages: z
    .array(z.enum(["pre-seed", "seed", "series-a", "series-b", "series-c", "growth"]))
    .min(1, "Please select at least one stage"),
  preferredSectors: z
    .array(
      z.enum([
        "ai-ml",
        "fintech",
        "healthtech",
        "cleantech",
        "saas",
        "consumer",
        "edtech",
        "foodtech",
        "agtech",
        "biotech",
        "hardware",
        "marketplace",
      ])
    )
    .min(1, "Please select at least one sector"),
}).refine((data) => data.checkSizeMax >= data.checkSizeMin, {
  message: "Maximum check size must be greater than or equal to minimum",
  path: ["checkSizeMax"],
});

export const investorThesisSchema = z.object({
  thesis: z
    .string()
    .min(100, "Investment thesis must be at least 100 characters")
    .max(1000, "Investment thesis must be less than 1000 characters"),
  portfolioCount: z.number().min(0, "Portfolio count cannot be negative"),
});

export const introRequestSchema = z.object({
  message: z
    .string()
    .min(50, "Message must be at least 50 characters")
    .max(500, "Message must be less than 500 characters"),
});

// Type exports
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type StartupBasicsFormData = z.infer<typeof startupBasicsSchema>;
export type StartupIndustryFormData = z.infer<typeof startupIndustrySchema>;
export type StartupFundingFormData = z.infer<typeof startupFundingSchema>;
export type StartupDeckFormData = z.infer<typeof startupDeckSchema>;
export type InvestorProfileFormData = z.infer<typeof investorProfileSchema>;
export type InvestorCriteriaFormData = z.infer<typeof investorCriteriaSchema>;
export type InvestorThesisFormData = z.infer<typeof investorThesisSchema>;
export type IntroRequestFormData = z.infer<typeof introRequestSchema>;
