"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

// User-friendly error block with an icon, message, and retry button.
// Shown when the result loading cycle fails (simulated via error toggle).

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
      {/* Error icon */}
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>

      {/* Error message */}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-foreground">
          Bir hata oluştu
        </h3>
        <p className="text-sm text-muted-foreground">
          Sonuçlar yüklenirken bir sorun yaşandı. Lütfen tekrar deneyin.
        </p>
      </div>

      {/* Retry button */}
      <button
        type="button"
        onClick={onRetry}
        className="
          inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-primary text-primary-foreground
          text-sm font-semibold
          shadow-sm hover:opacity-90 active:scale-[0.98]
          transition-all duration-150 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        "
      >
        <RotateCcw className="h-4 w-4" />
        Tekrar Dene
      </button>
    </div>
  );
}
