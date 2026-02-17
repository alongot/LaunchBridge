"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>100% Free - AI-Powered Matchmaking</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[var(--font-heading)] leading-tight mb-6">
            Where
            <span className="text-[var(--primary)]"> Startups</span> Meet Their Perfect
            <span className="text-[var(--secondary)]"> Investors</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
            LaunchBridge connects innovative founders with aligned investors through
            AI-powered matching. Skip the cold outreach and find your ideal
            funding partner.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?role=startup">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                I&apos;m a Startup
              </Button>
            </Link>
            <Link href="/signup?role=investor">
              <Button size="lg" variant="outline">
                I&apos;m an Investor
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16 pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)] mb-4">
              Trusted by founders and investors worldwide
            </p>
            <div className="flex items-center justify-center gap-8 text-[var(--muted)]">
              <div className="text-center">
                <p className="text-2xl font-semibold text-[var(--foreground)]">50+</p>
                <p className="text-sm">Startups</p>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div className="text-center">
                <p className="text-2xl font-semibold text-[var(--foreground)]">25+</p>
                <p className="text-sm">Investors</p>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div className="text-center">
                <p className="text-2xl font-semibold text-[var(--foreground)]">$10M+</p>
                <p className="text-sm">Funded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
