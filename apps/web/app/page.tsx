import { Header } from "@/components/landing/header";
import { SectionNav } from "@/components/landing/section-nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StorePreview } from "@/components/landing/store-preview";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <SectionNav />
      <Hero />
      <Features />
      <HowItWorks />
      <StorePreview />
      <CTA />
      <Footer />
    </main>
  );
}