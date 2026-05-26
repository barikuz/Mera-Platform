"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CategoryFilterChips } from "@/components/store/category-filter-chips";
import { ProductGrid } from "@/components/store/product-grid";
import { useShopCategories } from "@/hooks/use-shop-categories";
import { fetchShopProducts, type ShopProduct } from "@/lib/shop-api";

const PREVIEW_FILTERS = [
  "Tümü",
  "Oltalar",
  "Makineler",
  "Yemler",
  "Aksesuarlar",
] as const;

type PreviewFilter = (typeof PREVIEW_FILTERS)[number];

const PREVIEW_FILTER_CHIPS = PREVIEW_FILTERS.map((filter) => ({
  id: filter,
  label: filter,
}));

/** Ana sayfada gösterilen ürünler — sıra ve filtre eşlemesi sabit kalır */
const FEATURED_PRODUCTS: { nameMatch: string; filter: Exclude<PreviewFilter, "Tümü"> }[] = [
  { nameMatch: "Shimano Speedmaster Surf", filter: "Oltalar" },
  { nameMatch: "Daiwa BG 4000 Spinning", filter: "Makineler" },
  { nameMatch: "Doğal Karides Yem 75g", filter: "Yemler" },
  { nameMatch: "Su Geçirmez Balıkçı Yeleği", filter: "Aksesuarlar" },
];

type FeaturedProduct = ShopProduct & { previewFilter: Exclude<PreviewFilter, "Tümü"> };

function pickFeaturedProducts(products: ShopProduct[]): FeaturedProduct[] {
  const featured: FeaturedProduct[] = [];

  for (const { nameMatch, filter } of FEATURED_PRODUCTS) {
    const match = products.find((p) =>
      (p.name ?? "").toLowerCase().includes(nameMatch.toLowerCase())
    );
    if (match) {
      featured.push({ ...match, previewFilter: filter });
    }
  }

  return featured;
}

export function StorePreview() {
  const [activeFilter, setActiveFilter] = useState<PreviewFilter>("Tümü");

  const { categoryNameById, isPending: categoriesPending, isFetched: categoriesFetched, isError: categoriesError } =
    useShopCategories();

  const productsQuery = useQuery({
    queryKey: ["shop", "products", "all"],
    queryFn: () => fetchShopProducts(),
  });

  const featuredProducts = useMemo(
    () => pickFeaturedProducts(productsQuery.data ?? []),
    [productsQuery.data]
  );

  const visibleProducts = useMemo(() => {
    if (activeFilter === "Tümü") return featuredProducts;
    return featuredProducts.filter((p) => p.previewFilter === activeFilter);
  }, [activeFilter, featuredProducts]);

  const isLoading =
    (productsQuery.isPending && !productsQuery.isFetched) ||
    (categoriesPending && !categoriesFetched);

  const hasError = productsQuery.isError || categoriesError;

  return (
    <section id="store" className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <Badge variant="secondary" className="mb-4">
              Mağaza
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Balıkçı Mağazası
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Profesyonel balıkçılık ekipmanlarını keşfedin ve avınız için en uygun ürünleri bulun.
            </p>
          </div>
          <Button variant="outline" className="shrink-0" asChild>
            <Link href="/store">
              Tüm Ürünler
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <CategoryFilterChips
          chips={PREVIEW_FILTER_CHIPS}
          activeId={activeFilter}
          onSelect={(id) => setActiveFilter(id as PreviewFilter)}
          className="mb-8"
        />

        {hasError && (
          <div
            className="mb-8 rounded-lg border border-mera-status-error/30 bg-mera-status-error/10 px-4 py-3 text-sm text-mera-status-error"
            role="alert"
          >
            Ürünler yüklenirken bir hata oluştu.
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : visibleProducts.length === 0 ? (
          <p className="rounded-xl border border-border bg-card/50 px-4 py-12 text-center text-muted-foreground">
            {activeFilter === "Tümü"
              ? "Öne çıkan ürünler şu an yüklenemedi."
              : "Bu kategoride gösterilecek ürün bulunamadı."}
          </p>
        ) : (
          <ProductGrid
            products={visibleProducts}
            categoryNameById={categoryNameById}
            className="sm:grid-cols-2 lg:grid-cols-4"
          />
        )}
      </div>
    </section>
  );
}
