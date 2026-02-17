import { Navbar, Hero, HowItWorks, Features, CTA, Footer } from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="features">
        <Features />
      </section>
      <CTA />
      <Footer />
    </main>
  );
}
