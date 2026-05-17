"use client";

import { Crosshair } from "lucide-react";
import { TipResult, ResultStatus, FilterTag } from "@/types/assistant";
import { SkeletonCards } from "./skeleton-cards";
import { FilterTags } from "./filter-tags";
import { ErrorState } from "./error-state";
import { TipResultCard } from "./tip-result-card";

interface TipResultsSectionProps {
  status: ResultStatus;
  results: TipResult[];
  filterTags: FilterTag[];
  onRetry: () => void;
}

// Wrapper section for technique tips results.
// Renders tip cards stacked vertically with section header and filter tags.

export function TipResultsSection({
  status,
  results,
  filterTags,
  onRetry,
}: TipResultsSectionProps) {
  if (status === "idle") return null;

  return (
    <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <Crosshair className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Av Taktikleri</h3>
        {status === "success" && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary dark:bg-mera-neutral-800 text-muted-foreground border border-border">
            {results.length} tavsiye
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
        <div className="space-y-4">
          {results.map((result, idx) => (
            <TipResultCard key={idx} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
