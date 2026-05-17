"use client";

import { Map, Waves } from "lucide-react";
import { SpotResult } from "@/types/assistant";

interface SpotResultCardProps {
  result: SpotResult;
  onShowMap: (result: SpotResult) => void;
}

// Individual spot recommendation card.
// Shows spot name, description, water type/depth tags, and a "Haritada Gör" button.

export function SpotResultCard({ result, onShowMap }: SpotResultCardProps) {
  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-card dark:bg-card/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Title */}
      <h4 className="text-base font-bold text-foreground leading-snug mb-2">
        {result.spotName}
      </h4>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
        {result.description}
      </p>

      {/* Footer: tags + map button */}
      <div className="mt-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Water type tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {result.waterType}
          </span>

          {/* Depth indicator */}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Waves className="h-3.5 w-3.5" />
            {result.depth}
          </span>
        </div>

        {/* "Haritada Gör" button */}
        <button
          type="button"
          onClick={() => onShowMap(result)}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-semibold
            text-primary dark:text-primary
            bg-primary/5 dark:bg-primary/10
            border border-primary/20 dark:border-primary/30
            hover:bg-primary/10 dark:hover:bg-primary/20
            transition-all duration-150 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        >
          <Map className="h-3.5 w-3.5" />
          Haritada Gör
        </button>
      </div>
    </div>
  );
}
