"use client";

import { Sparkles } from "lucide-react";

interface SubmitButtonProps {
  label: string;
}

export function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="
        w-full flex items-center justify-center gap-2.5 h-11 rounded-xl px-6
        bg-primary text-primary-foreground font-semibold text-sm
        shadow-sm hover:bg-primary/90 dark:hover:bg-primary/80
        dark:hover:shadow-[0_0_20px_rgba(0,204,178,0.35)]
        transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        active:scale-[0.98]
      "
    >
      <Sparkles className="h-4.5 w-4.5 flex-shrink-0" />
      {label}
    </button>
  );
}
