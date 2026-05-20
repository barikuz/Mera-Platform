"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { formatTry } from "@/lib/format-try";
import { cn } from "@/lib/utils";

export function CartDropdown() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    items,
    itemCount,
    totalPrice,
    increment,
    decrement,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (!isOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const totalText = useMemo(() => formatTry(totalPrice), [totalPrice]);

  function handleCheckout() {
    if (isAuthLoading || items.length === 0) return;

    if (!user) {
      setAuthMessage("Ödeme için giriş yapmanız gerekiyor.");
      window.setTimeout(() => {
        setIsOpen(false);
        router.push("/login?redirect=/checkout");
      }, 1200);
      return;
    }

    setAuthMessage("");
    setIsOpen(false);
    router.push("/checkout");
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          setAuthMessage("");
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Sepeti aç"
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground">
            {itemCount}
          </span>
        ) : null}
      </Button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label="Sepet"
          className={cn(
            "absolute right-0 mt-2 w-[min(92vw,430px)] overflow-hidden rounded-2xl border border-border",
            "bg-popover text-popover-foreground shadow-xl shadow-black/10 dark:shadow-black/30",
            "animate-in fade-in slide-in-from-top-2 duration-200 z-50"
          )}
        >
          <div className="flex h-[min(78vh,34rem)] flex-col">
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold">Sepetim</p>
                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    Tümünü temizle
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mera-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 px-6 text-center">
                  <ShoppingCart className="mb-3 h-7 w-7 text-muted-foreground" />
                  <p className="font-medium">Sepetin şu anda boş</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mağazadan ürün eklediğinde burada görünecek.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-border/80 bg-card p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name ?? "Ürün görseli"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Görsel
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold">
                          {item.name ?? "Adsız ürün"}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {formatTry(item.price)} / adet
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-full border border-border bg-background px-2 py-1">
                            <button
                              type="button"
                              onClick={() => decrement(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary cursor-pointer"
                              aria-label="Adedi azalt"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increment(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary cursor-pointer"
                              aria-label="Adedi artır"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-mera-status-error transition-colors hover:bg-mera-status-error/10 cursor-pointer"
                            aria-label="Ürünü sepetten sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="sticky bottom-0 border-t border-border bg-popover px-4 pb-4 pt-3">
              {authMessage ? (
                <div
                  role="alert"
                  className="mb-3 rounded-lg border border-mera-status-warning/30 bg-mera-status-warning/10 px-3 py-2 text-sm text-mera-status-warning"
                >
                  {authMessage}
                </div>
              ) : null}
              <div className="mb-3 flex items-center justify-between text-base font-semibold">
                <span>Genel Toplam</span>
                <span>{totalText}</span>
              </div>
              <Button
                type="button"
                className="w-full"
                disabled={items.length === 0 || isAuthLoading}
                onClick={handleCheckout}
              >
                Ödemeye Geç
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
