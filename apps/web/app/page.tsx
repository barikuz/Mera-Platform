import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description:
    "Yapay zeka destekli balıkçılık asistanı ile en iyi avlanma noktalarını keşfet, öneriler al ve balıkçılık ekipmanlarını kolayca satın al.",
};

import { Header } from "@/components/landing/header";
import { SectionNav } from "@/components/landing/section-nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StorePreview } from "@/components/landing/store-preview";
import { CTA } from "@/components/landing/cta";
import { OrderSuccessToast } from "@/components/ui/order-success-toast";

export default function Home() {
  return (
    <main className="min-h-screen">
      <OrderSuccessToast />
      <Header />
      <SectionNav />
      <Hero />
      <Features />
      <HowItWorks />
      <StorePreview />
      <CTA />
    </main>
  );
}