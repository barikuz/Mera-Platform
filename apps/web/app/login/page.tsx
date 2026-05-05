import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "Giriş Yap | Mera",
  description: "Mera hesabınıza giriş yapın.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {/* Back Button */}
      <BackButton />

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg shadow-mera-primary/5">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-comfortaa-bold text-3xl tracking-wider text-primary">
              Mera
            </h1>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Hesabınıza giriş yapın
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-card-foreground"
            >
              E-posta
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="ornek@email.com"
              autoComplete="email"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-card-foreground"
            >
              Şifre
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Şifrenizi mi Unuttunuz?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Giriş Yap
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">veya</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
