"use client";

import { MapPin } from "lucide-react";
import { SpotResult, ResultStatus, FilterTag } from "@/types/assistant";
import { SkeletonCards } from "./skeleton-cards";
import { FilterTags } from "./filter-tags";
import { ErrorState } from "./error-state";
import { SpotResultCard } from "./spot-result-card";

interface SpotResultsSectionProps {
  status: ResultStatus;
  results: SpotResult[];
  filterTags: FilterTag[];
  onRetry: () => void;
  onShowMap: (result: SpotResult) => void;
}

// Wrapper section for Spot recommendation results.
// Handles idle/loading/success/error states and renders the results grid.

export function SpotResultsSection({
  status,
  results,
  filterTags,
  onRetry,
  onShowMap,
}: SpotResultsSectionProps) {
  // Don't render anything before first submission
  if (status === "idle") return null;

  return (
    <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Önerilen Meralar</h3>
        {status === "success" && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary dark:bg-mera-neutral-800 text-muted-foreground border border-border">
            {results.length} sonuç
          </span>
        )}
      </div>

      {/* Filter tags */}
      {status === "success" && (
        <div className="mb-4">
          <FilterTags tags={filterTags} />
        </div>
      )}

      {/* Content based on status */}
      {status === "loading" && <SkeletonCards />}

      {status === "error" && <ErrorState onRetry={onRetry} />}

      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, idx) => (
            <SpotResultCard key={idx} result={result} onShowMap={onShowMap} />
          ))}
        </div>
      )}
    </div>
  );
}
