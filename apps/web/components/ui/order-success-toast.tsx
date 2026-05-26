"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import {
  clearOrderSuccess,
  hasPendingOrderSuccess,
} from "@/lib/order-success";
import { cn } from "@/lib/utils";

export function OrderSuccessToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasPendingOrderSuccess()) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-4 top-24 z-[100] w-[min(92vw,420px)]",
        "animate-in fade-in slide-in-from-top-2 duration-300"
      )}
    >
      <div className="flex items-start gap-3 rounded-xl border border-mera-status-success/30 bg-card px-4 py-3.5 shadow-lg shadow-black/10 dark:shadow-black/30">
        <CheckCircle2
          className="mt-0.5 h-5 w-5 shrink-0 text-mera-status-success"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Ödemeniz başarıyla tamamlandı
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Siparişiniz alındı. Teşekkür ederiz.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearOrderSuccess();
            setIsVisible(false);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          aria-label="Bildirimi kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
