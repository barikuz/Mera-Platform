import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { StoreView } from "@/components/store/store-view";

export const metadata: Metadata = {
  title: "Mağaza",
  description:
    "Balıkçılık ekipmanlarını keşfedin, kategorilere göre filtreleyin ve Mera mağazasından güvenle alışveriş yapın.",
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-16">
        <StoreView />
      </main>
    </div>
  );
}
