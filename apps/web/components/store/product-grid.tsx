import { ProductCard } from "@/components/store/product-card";
import type { ShopProduct } from "@/lib/shop-api";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  products: ShopProduct[];
  categoryNameById: Map<string, string>;
  className?: string;
};

export function ProductGrid({
  products,
  categoryNameById,
  className,
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryLabel={
            product.category_id
              ? categoryNameById.get(product.category_id)
              : undefined
          }
        />
      ))}
    </div>
  );
}
