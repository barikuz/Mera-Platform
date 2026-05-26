"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SecretInputProps = Omit<ComponentProps<"input">, "type"> & {
  toggleShowLabel?: string;
  toggleHideLabel?: string;
};

export function SecretInput({
  className,
  disabled,
  toggleShowLabel = "Göster",
  toggleHideLabel = "Gizle",
  ...props
}: SecretInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type="text"
        disabled={disabled}
        className={cn(
          className,
          "pr-11",
          !isVisible && "[-webkit-text-security:disc]"
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-60 cursor-pointer"
        aria-label={isVisible ? toggleHideLabel : toggleShowLabel}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" aria-hidden />
        ) : (
          <Eye className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
