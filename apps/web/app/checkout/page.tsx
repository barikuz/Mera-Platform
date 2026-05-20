import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Ödeme",
  description: "Teslimat ve ödeme bilgilerinizi girerek siparişinizi tamamlayın.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-16">
        <CheckoutView />
      </main>
    </div>
  );
}
