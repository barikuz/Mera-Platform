"use client";

import { BrainCog } from "lucide-react";
import { EquipmentResult } from "@/types/assistant";
import { EQUIPMENT_CATEGORY_ICONS } from "@/constants/assistant-results";

interface EquipmentResultCardProps {
  result: EquipmentResult;
}

// Individual equipment recommendation card.
// Category icon on left, product name + price on right, expert note below.

export function EquipmentResultCard({ result }: EquipmentResultCardProps) {
  const categoryIcon = EQUIPMENT_CATEGORY_ICONS[result.category] ?? "🎣";

  // Category-specific accent colour mapping
  const categoryColors: Record<string, string> = {
    "Kamış":
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    "Makine":
      "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    "Yem / Sahte Yem":
      "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };

  const colorClass =
    categoryColors[result.category] ??
    "bg-secondary text-foreground border-border";

  return (
    <div className="rounded-xl border border-border bg-card dark:bg-card/80 p-5 shadow-sm">
      {/* Top row: icon + product info */}
      <div className="flex items-start gap-4">
        {/* Category icon container */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-secondary/60 dark:bg-mera-neutral-800/60 border border-border dark:border-mera-neutral-700 flex items-center justify-center text-2xl">
          {categoryIcon}
        </div>

        {/* Product details */}
        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-1.5 ${colorClass}`}
          >
            {result.category}
          </span>

          {/* Product name */}
          <h4 className="text-base font-bold text-foreground leading-snug">
            {result.productName}
          </h4>

          {/* Price */}
          <p className="text-base font-bold text-primary mt-0.5">
            ₺{result.price.toLocaleString("tr-TR")}
          </p>
        </div>
      </div>

      {/* Expert note */}
      <div className="mt-4 rounded-lg bg-secondary/40 dark:bg-mera-neutral-800/40 border border-border/60 dark:border-mera-neutral-700/60 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <BrainCog className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Uzman Notu
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.expertNote}
        </p>
      </div>
    </div>
  );
}
