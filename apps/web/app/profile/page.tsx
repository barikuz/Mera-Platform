"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCatches } from "@/hooks/use-catches";
import { fetchFishSpeciesCatalog } from "@/lib/catches-api";
import { logout } from "@/lib/auth";
import { FullScreenSpinner } from "@/components/ui/spinner";
import { CatchStatsDashboard } from "@/components/profile/catch-stats-dashboard";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { Header } from "@/components/landing/header";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Fetch catches & species once the user is confirmed
  const catchesQuery = useCatches(!!user && !isLoading);
  const speciesQuery = useQuery({
    queryKey: ["catalog", "fish-species"],
    queryFn: fetchFishSpeciesCatalog,
    enabled: !!user && !isLoading,
    staleTime: 5 * 60 * 1000,
  });

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

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page heading */}
        <div className="mb-10 flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Profilim
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Left column: Sidebar */}
          <div>
            <ProfileSidebar
              displayName={displayName}
              email={email}
              avatarUrl={avatarUrl}
              initials={initials}
              onLogout={handleLogout}
            />
          </div>

          {/* Right column: Stats dashboard */}
          <div>
            <CatchStatsDashboard
              catches={catchesQuery.data ?? []}
              species={speciesQuery.data ?? []}
              isLoading={catchesQuery.isLoading || speciesQuery.isLoading}
              isError={catchesQuery.isError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
