import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description:
    "Mera hesabınıza giriş yaparak av istatistiklerinizi kaydedin ve geçmiş performansınızı takip edin.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
