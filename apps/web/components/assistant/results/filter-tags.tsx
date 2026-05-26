"use client";

import { FilterTag } from "@/types/assistant";

interface FilterTagsProps {
  tags: FilterTag[];
}

// Pill-shaped tags summarising the user's form selections (e.g. 🐟 Levrek).
// Displayed above the result cards, matching the mobile "Önerilen Ekipman Seti" tag row.

export function FilterTags({ tags }: FilterTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full
            text-xs font-medium
            bg-secondary/70 dark:bg-mera-neutral-800/70
            text-foreground dark:text-zinc-200
            border border-border dark:border-mera-neutral-700
          "
        >
          <span>{tag.emoji}</span>
          <span>{tag.label}</span>
        </span>
      ))}
    </div>
  );
}
