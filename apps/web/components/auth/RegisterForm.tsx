"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerWithEmail } from "@/lib/auth";
import { BackButton } from "@/components/ui/back-button";

type FieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
};

export function RegisterForm() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!displayName.trim()) {
      errors.displayName = "Görünen ad gereklidir.";
    } else if (displayName.trim().length < 2) {
      errors.displayName = "Görünen ad en az 2 karakter olmalıdır.";
    }

    if (!email.trim()) {
      errors.email = "E-posta adresi gereklidir.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Geçerli bir e-posta adresi girin.";
    }

    if (!password) {
      errors.password = "Şifre gereklidir.";
    } else if (password.length < 6) {
      errors.password = "Şifre en az 6 karakter olmalıdır.";
    }

    if (!passwordConfirm) {
      errors.passwordConfirm = "Şifre tekrarı gereklidir.";
    } else if (password !== passwordConfirm) {
      errors.passwordConfirm = "Şifreler eşleşmiyor.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsLoading(true);

    const result = await registerWithEmail(
      email.trim(),
      password,
      displayName.trim()
    );

    if (result.success) {
      router.push("/login?registered=true");
    } else {
      setFormError(result.error);
      setIsLoading(false);
    }
  }

  const inputBaseClass =
    "w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const inputNormalClass =
    "border-input focus:border-primary focus:ring-ring/30";
  const inputErrorClass =
    "border-mera-status-error focus:border-mera-status-error focus:ring-mera-status-error/30";

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
            Yeni hesap oluşturun
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Display Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-name"
              className="block text-sm font-medium text-card-foreground"
            >
              Görünen Ad
            </label>
            <input
              id="register-name"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                clearFieldError("displayName");
              }}
              placeholder="Adınız"
              autoComplete="name"
              disabled={isLoading}
              className={`${inputBaseClass} ${
                fieldErrors.displayName ? inputErrorClass : inputNormalClass
              }`}
            />
            {fieldErrors.displayName && (
              <p className="text-xs text-mera-status-error mt-1">
                {fieldErrors.displayName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-card-foreground"
            >
              E-posta
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              placeholder="ornek@email.com"
              autoComplete="email"
              disabled={isLoading}
              className={`${inputBaseClass} ${
                fieldErrors.email ? inputErrorClass : inputNormalClass
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
              htmlFor="register-password"
              className="block text-sm font-medium text-card-foreground"
            >
              Şifre
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              className={`${inputBaseClass} ${
                fieldErrors.password ? inputErrorClass : inputNormalClass
              }`}
            />
            {fieldErrors.password && (
              <p className="text-xs text-mera-status-error mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-confirm-password"
              className="block text-sm font-medium text-card-foreground"
            >
              Şifre Tekrar
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                clearFieldError("passwordConfirm");
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              className={`${inputBaseClass} ${
                fieldErrors.passwordConfirm ? inputErrorClass : inputNormalClass
              }`}
            />
            {fieldErrors.passwordConfirm && (
              <p className="text-xs text-mera-status-error mt-1">
                {fieldErrors.passwordConfirm}
              </p>
            )}
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
                Kayıt yapılıyor...
              </span>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">veya</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
