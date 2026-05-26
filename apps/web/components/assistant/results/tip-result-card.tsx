"use client";

import { Play, Disc, CheckCircle, Lightbulb, Clock, Waves,FishingHook, LucideIcon } from "lucide-react";
import { TipResult } from "@/types/assistant";

interface TipResultCardProps {
  result: TipResult;
}

const HEADER_ICONS: Record<string, LucideIcon> = {
  "En Verimli Zaman": Clock,
  "Olta Aksiyonu": Waves,
  "Yem Seçimi": FishingHook,
};

const ITEM_ICONS: Record<string, LucideIcon> = {
  "En Verimli Zaman": CheckCircle,
  "Olta Aksiyonu": Play,
  "Yem Seçimi": Disc,
};

// Individual technique tip card.
// Icon + title, highlighted subtitle, bullet-point list with check icons.

export function TipResultCard({ result }: TipResultCardProps) {
  const HeaderIcon = HEADER_ICONS[result.title] ?? Lightbulb;
  const BulletIcon = ITEM_ICONS[result.title] ?? CheckCircle;

  // Render "Location Selection" / "Konum Stratejisi" as a single highlighted paragraph
  if (result.title === "Konum Stratejisi") {
    return (
      <div className="rounded-xl border border-border bg-secondary/50 dark:bg-mera-neutral-900/50 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h4 className="text-base font-bold text-foreground">{result.title}</h4>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {result.items.join(" ")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card dark:bg-card/80 p-5 shadow-sm">
      {/* Header: icon + title */}
      <div className="flex items-center gap-2.5 mb-2">
        <HeaderIcon className="w-5 h-5 text-primary" />
        <h4 className="text-base font-bold text-foreground">{result.title}</h4>
      </div>

      {/* Subtitle */}
      {result.subtitle && (
        <p className="text-sm font-semibold text-foreground/80 dark:text-zinc-300 mb-3 pl-[calc(1.125rem+0.625rem)]">
          {result.subtitle}
        </p>
      )}

      {/* Bullet list */}
      <ul className="space-y-2 pl-[calc(1.125rem+0.625rem)]">
        {result.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
            <BulletIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
