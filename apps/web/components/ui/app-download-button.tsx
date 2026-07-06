"use client";

import { Smartphone, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const APK_URL =
  "https://github.com/barikuz/Mera-Mobile/releases/download/v1.0.0/mera.apk";

interface AppDownloadButtonProps {
  className?: string;
}

export function AppDownloadButton({ className }: AppDownloadButtonProps) {
  return (
    <a
      href={APK_URL}
      download
      aria-label="Mobil uygulamayı indir"
      className={cn(
        `group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full
        bg-gradient-to-r from-mera-primary to-mera-primary/85
        dark:from-mera-accent dark:to-emerald-500
        px-4 py-2.5 text-sm font-semibold text-white dark:text-mera-neutral-950
        shadow-md shadow-mera-primary/25 dark:shadow-mera-accent/25
        hover:shadow-lg hover:shadow-mera-primary/30 dark:hover:shadow-mera-accent/35
        transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]`,
        className
      )}
    >
      {/* Shimmer effect on hover */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          transition-transform duration-700 ease-out group-hover:translate-x-full"
        aria-hidden="true"
      />

      <Smartphone className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-[-8deg]" />
      <span className="whitespace-nowrap">
        Mobil Uygulamamızı İndirin
      </span>
      <Download className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-y-0.5" />
    </a>
  );
}
