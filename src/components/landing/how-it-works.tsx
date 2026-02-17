import { UserPlus, Search, Handshake } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Tell us about your startup or investment criteria. Our onboarding takes just a few minutes.",
    color: "bg-[var(--primary)]",
  },
  {
    icon: Search,
    title: "Get Matched",
    description:
      "Our AI analyzes compatibility based on stage, sector, check size, and investment thesis.",
    color: "bg-[var(--secondary)]",
  },
  {
    icon: Handshake,
    title: "Connect & Grow",
    description:
      "Request warm introductions to your best matches. We handle the connection, you focus on building.",
    color: "bg-[var(--success)]",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] mb-4">
            How It Works
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            From sign-up to funded in three simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-[var(--border)]" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div
                      className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center`}
                    >
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--background)] border-2 border-[var(--border)] flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-[var(--muted)]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
