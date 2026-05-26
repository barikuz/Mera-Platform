"use client";

import { useState } from "react";
import { Backpack, ShoppingCart, Check } from "lucide-react";
import { EquipmentResult, ResultStatus, FilterTag } from "@/types/assistant";
import { SkeletonCards } from "./skeleton-cards";
import { FilterTags } from "./filter-tags";
import { ErrorState } from "./error-state";
import { EquipmentResultCard } from "./equipment-result-card";
import { useCart } from "@/hooks/use-cart";

interface EquipmentResultsSectionProps {
  status: ResultStatus;
  results: EquipmentResult[];
  filterTags: FilterTag[];
  onRetry: () => void;
}

// Wrapper section for equipment recommendation results.
// Renders cards, total price, and "Tüm Seti Sepete Ekle" CTA button.

export function EquipmentResultsSection({
  status,
  results,
  filterTags,
  onRetry,
}: EquipmentResultsSectionProps) {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddAllToCart = async () => {
    setIsAddingToCart(true);
    
    // Add a small delay to make the interaction feel intentional
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Add all items to cart
    results.forEach((result) => {
      addItem({
        id: result.productId || `equipment-${result.productName}`,
        name: result.productName,
        price: result.price,
        image_url: result.image_url,
      });
    });

    setIsAddingToCart(false);
    setAddedToCart(true);

    // Reset the success state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (status === "idle") return null;

  const totalPrice = results.reduce((sum, r) => sum + r.price, 0);

  return (
    <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <Backpack className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">
          Önerilen Ekipman Seti
        </h3>
        {status === "success" && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary dark:bg-mera-neutral-800 text-muted-foreground border border-border">
            {results.length} parça
          </span>
        )}
      </div>

      {/* Filter tags */}
      {status === "success" && (
        <div className="mb-4">
          <FilterTags tags={filterTags} />
        </div>
      )}

      {/* Content based on status */}
      {status === "loading" && <SkeletonCards />}

      {status === "error" && <ErrorState onRetry={onRetry} />}

      {status === "success" && (
        <>
          {/* Equipment cards stack */}
          <div className="space-y-4">
            {results.map((result, idx) => (
              <EquipmentResultCard key={idx} result={result} />
            ))}
          </div>

          {/* Total price row */}
          <div className="mt-6 flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-card dark:bg-card/80">
            <span className="text-base font-semibold text-foreground">
              Toplam Set Fiyatı
            </span>
            <span className="text-xl font-bold text-primary">
              ₺{totalPrice.toLocaleString("tr-TR")}
            </span>
          </div>

          {/* Add to cart CTA */}
          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={isAddingToCart}
            className={`
              w-full flex items-center justify-center gap-2.5 h-12 mt-4 rounded-xl px-6
              font-semibold text-sm
              shadow-sm transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              active:scale-[0.98]
              ${
                addedToCart
                  ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 dark:hover:shadow-[0_0_20px_rgba(0,204,178,0.35)]"
              }
              ${isAddingToCart ? "opacity-75 cursor-wait" : "cursor-pointer"}
            `}
          >
            {addedToCart ? (
              <>
                <Check className="h-5 w-5" />
                Sepete Eklendi
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Tüm Seti Sepete Ekle
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
