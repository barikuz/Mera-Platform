import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description:
    "Ücretsiz Mera hesabı oluşturarak yakaladığınız balıkları kaydedin ve av istatistiklerinizi takip edin.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
