"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Fish, TrendingUp } from "lucide-react";
import type { CatchRecord, FishSpeciesCatalogItem } from "@/lib/catches-api";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "./empty-state";
import { MetricsCards } from "./metrics-cards";
import { CatchHistoryList } from "./catch-history-list";

// ── Dynamic Imports for Charts ──────────────────────────────────────────────

const MonthlyChart = dynamic(
  () => import("./monthly-chart").then((mod) => mod.MonthlyChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card border border-border rounded-xl p-5 h-[235px] flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-muted/10 rounded-lg" />
      </div>
    ),
  }
);

const SpeciesChart = dynamic(
  () => import("./species-chart").then((mod) => mod.SpeciesChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card border border-border rounded-xl p-5 h-[295px] flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-muted/10 rounded-lg" />
      </div>
    ),
  }
);

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  catches: CatchRecord[];
  species: FishSpeciesCatalogItem[];
  isLoading: boolean;
  isError: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Format a Date to "GG Ay" in Turkish locale */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CatchStatsDashboard({ catches, species, isLoading, isError }: Props) {
  // Build a species id → name map
  const speciesMap = useMemo(
    () => new Map(species.map((s) => [s.id, s.name])),
    [species]
  );

  // Derived stats
  const stats = useMemo(() => {
    if (!catches.length) return null;

    const total = catches.length;

    const withWeight = catches.filter((c) => c.weight_kg != null);
    const heaviest = withWeight.length
      ? withWeight.reduce((a, b) =>
          (b.weight_kg ?? 0) > (a.weight_kg ?? 0) ? b : a
        )
      : null;

    const withLength = catches.filter((c) => c.length_cm != null);
    const longest = withLength.length
      ? withLength.reduce((a, b) =>
          (b.length_cm ?? 0) > (a.length_cm ?? 0) ? b : a
        )
      : null;

    // Sort catches chronologically (oldest to newest) to show a proper timeline
    const sortedCatches = [...catches].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Group catches by day/date for a daily frequency timeline
    const dateMap = new Map<string, number>();
    sortedCatches.forEach((c) => {
      const key = formatDate(c.created_at);
      dateMap.set(key, (dateMap.get(key) ?? 0) + 1);
    });

    const monthlyData = Array.from(dateMap.entries()).map(([month, count]) => ({
      month, // keeping property name as 'month' to match child component Prop contract
      count,
    }));

    // Species distribution
    const speciesCount = new Map<string, number>();
    catches.forEach((c) => {
      const name = speciesMap.get(c.species_id) ?? "Bilinmiyor";
      speciesCount.set(name, (speciesCount.get(name) ?? 0) + 1);
    });
    const speciesData = Array.from(speciesCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      total,
      heaviest: heaviest?.weight_kg
        ? {
            weight: heaviest.weight_kg,
            speciesName: speciesMap.get(heaviest.species_id) ?? "",
          }
        : null,
      longest: longest?.length_cm
        ? {
            length: longest.length_cm,
            speciesName: speciesMap.get(longest.species_id) ?? "",
          }
        : null,
      monthlyData,
      speciesData,
    };
  }, [catches, speciesMap]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Fish className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          İstatistikler yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  if (!catches.length || !stats) {
    return <EmptyState />;
  }

  // ── Full dashboard ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">İstatistiklerim</h2>
          <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
        </div>
      </div>

      {/* KPI Cards */}
      <MetricsCards
        totalCatches={stats.total}
        speciesCount={stats.speciesData.length}
        heaviestCatch={stats.heaviest}
        longestCatch={stats.longest}
      />

      {/* Monthly frequency chart */}
      <MonthlyChart data={stats.monthlyData} />

      {/* Species distribution pie */}
      <SpeciesChart data={stats.speciesData} />

      {/* Catch history list */}
      <CatchHistoryList catches={catches} species={species} />
    </div>
  );
}
