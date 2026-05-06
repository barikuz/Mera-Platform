"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginWithEmail } from "@/lib/auth";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/hooks/use-auth";
import { FullScreenSpinner } from "@/components/ui/spinner";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const { user, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    justRegistered
      ? "Hesabınız başarıyla oluşturuldu. Lütfen giriş yapın."
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace("/");
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || user) {
    return <FullScreenSpinner />;
  }

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = "E-posta adresi gereklidir.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Geçerli bir e-posta adresi girin.";
    }

    if (!password) {
      errors.password = "Şifre gereklidir.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsLoading(true);

    const result = await loginWithEmail(email.trim(), password);

    if (result.success) {
      router.push("/");
    } else {
      setFormError(result.error);
      setIsLoading(false);
    }
  }

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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-5 rounded-lg border border-mera-status-success/30 bg-mera-status-success/10 px-4 py-3 text-sm text-mera-status-success">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="ornek@email.com"
              autoComplete="email"
              disabled={isLoading}
              className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                fieldErrors.email
                  ? "border-mera-status-error focus:border-mera-status-error focus:ring-mera-status-error/30"
                  : "border-input focus:border-primary focus:ring-ring/30"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-mera-status-error mt-1">
                {fieldErrors.email}
              </p>
            )}
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                fieldErrors.password
                  ? "border-mera-status-error focus:border-mera-status-error focus:ring-mera-status-error/30"
                  : "border-input focus:border-primary focus:ring-ring/30"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-xs text-mera-status-error mt-1">
                {fieldErrors.password}
              </p>
            )}
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

          {/* Form Error */}
          {formError && (
            <div className="rounded-lg border border-mera-status-error/30 bg-mera-status-error/10 px-4 py-3 text-sm text-mera-status-error">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formError}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Giriş yapılıyor...
              </span>
            ) : (
              "Giriş Yap"
            )}
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
