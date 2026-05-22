"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { FullScreenSpinner } from "@/components/ui/spinner";
import { LogOut, User } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <FullScreenSpinner />;
  }

  const displayName =
    (user.user_metadata?.display_name as string) || "Kullanıcı";
  const email = user.email || "";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-5">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Profilim
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-8 mb-6">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 dark:bg-primary/20 border-3 border-primary/30 dark:border-primary/40 text-primary font-bold text-2xl overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Name & email */}
            <div className="text-center">
              <p className="text-xl font-semibold text-foreground">
                {displayName}
              </p>
              {email && (
                <p className="text-sm text-muted-foreground mt-1">{email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/profile/add-catch">
            <Button className="w-full h-12 text-base gap-2" size="lg">
              Av Kaydı Ekle
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full h-12 text-base gap-2 text-mera-status-error hover:text-mera-status-error hover:bg-mera-status-error/10 hover:border-mera-status-error/30"
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Çıkış Yap
          </Button>
        </div>
      </main>
    </div>
  );
}
