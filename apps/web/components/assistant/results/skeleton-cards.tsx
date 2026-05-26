"use client";

// Skeleton placeholder cards shown during the loading state.
// Renders 3 pulsing rectangular blocks that mimic result card shapes.

export function SkeletonCards() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-card dark:bg-card/60 p-6"
        >
          {/* Title skeleton */}
          <div className="h-5 w-3/5 rounded-md bg-muted dark:bg-mera-neutral-700/60 mb-4" />
          {/* Body skeleton lines */}
          <div className="space-y-2.5">
            <div className="h-3.5 w-full rounded-md bg-muted dark:bg-mera-neutral-700/40" />
            <div className="h-3.5 w-4/5 rounded-md bg-muted dark:bg-mera-neutral-700/40" />
          </div>
          {/* Footer skeleton pills */}
          <div className="flex items-center gap-3 mt-5">
            <div className="h-6 w-16 rounded-full bg-muted dark:bg-mera-neutral-700/50" />
            <div className="h-6 w-20 rounded-full bg-muted dark:bg-mera-neutral-700/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
