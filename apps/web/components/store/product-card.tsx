import { ImageOff, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ShopProduct } from "@/lib/shop-api";
import { formatTry } from "@/lib/format-try";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  categoryLabel,
}: {
  product: ShopProduct;
  categoryLabel?: string;
}) {
  const src = product.image_url?.trim();
  const hasImage = Boolean(src);

  return (
    <Card className="group gap-0 py-0 overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          {hasImage ? (
            <img
              src={src}
              alt={product.name ?? "Ürün görseli"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="h-10 w-10 opacity-50" aria-hidden />
              <span className="sr-only">Görsel yok</span>
            </div>
          )}
        </div>
        <div className="px-4 pt-3 pb-4">
          {categoryLabel ? (
            <Badge variant="secondary" className="mb-2 text-xs">
              {categoryLabel}
            </Badge>
          ) : null}
          <h2 className="mb-2 line-clamp-2 font-semibold text-foreground">
            {product.name ?? "Adsız ürün"}
          </h2>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-primary">
              {formatTry(product.price)}
            </span>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={cn(
                "h-9 w-9 shrink-0 border-primary/20 text-primary",
                "hover:bg-primary hover:text-primary-foreground dark:border-primary/40"
              )}
              aria-label="Sepete ekle (yakında)"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
