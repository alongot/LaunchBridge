import {
  Brain,
  Shield,
  Zap,
  BarChart3,
  Users,
  Gift,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features: Array<{
  icon: typeof Gift;
  title: string;
  description: string;
  highlight?: boolean;
}> = [
  {
    icon: Gift,
    title: "100% Free Forever",
    description:
      "No hidden fees, no premium tiers. Full access to all features at no cost.",
    highlight: true,
  },
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our algorithm analyzes 50+ data points to find your most compatible matches.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "All investors are verified. All startups are reviewed for quality.",
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description:
      "Request introductions with one click. No cold emails needed.",
  },
  {
    icon: BarChart3,
    title: "Match Insights",
    description:
      "Understand why you matched with detailed compatibility breakdowns.",
  },
  {
    icon: Users,
    title: "Warm Intros Only",
    description:
      "Both parties must opt in. Quality over quantity, always.",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] mb-4">
            Why LaunchBridge?
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            We&apos;ve built the features that founders and investors actually need
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-md transition-shadow duration-200 ${
                feature.highlight ? "ring-2 ring-[var(--success)] bg-[var(--success)]/5" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mb-4 transition-colors ${
                  feature.highlight
                    ? "bg-[var(--success)]/20 group-hover:bg-[var(--success)]/30"
                    : "bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20"
                }`}>
                  <feature.icon className={`h-6 w-6 ${feature.highlight ? "text-[var(--success)]" : "text-[var(--primary)]"}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
