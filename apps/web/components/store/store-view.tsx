"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { InlineLoader, Spinner } from "@/components/ui/spinner";
import { CategoryFilterChips } from "@/components/store/category-filter-chips";
import { ProductGrid } from "@/components/store/product-grid";
import { useShopCategories } from "@/hooks/use-shop-categories";
import { fetchShopProducts } from "@/lib/shop-api";
import { buildStoreCategoryChips } from "@/lib/shop-utils";

export function StoreView() {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const {
    data: categories,
    categoryNameById,
    isPending: categoriesPending,
    isFetched: categoriesFetched,
    isError: categoriesError,
    error: categoriesQueryError,
  } = useShopCategories();

  const productsQuery = useQuery({
    queryKey: ["shop", "products", categoryId ?? "all"],
    queryFn: () => fetchShopProducts(categoryId),
  });

  const categoryChips = useMemo(
    () => buildStoreCategoryChips(categories ?? []),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const list = productsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => (p.name ?? "").toLowerCase().includes(q));
  }, [productsQuery.data, search]);

  const productsError = productsQuery.isError;
  const showInitialLoader =
    (categoriesPending || productsQuery.isPending) &&
    !categoriesFetched &&
    !productsQuery.isFetched;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mağaza
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Balıkçılık ekipmanlarını keşfedin; kategoriye göre filtreleyin veya ürün adıyla arayın.
        </p>
      </div>

      {(categoriesError || productsError) && (
        <div
          className="mb-8 rounded-lg border border-mera-status-error/30 bg-mera-status-error/10 px-4 py-3 text-sm text-mera-status-error"
          role="alert"
        >
          {categoriesQueryError instanceof Error
            ? categoriesQueryError.message
            : productsQuery.error instanceof Error
              ? productsQuery.error.message
              : "Ürünler veya kategoriler yüklenirken bir hata oluştu."}
        </div>
      )}

      <div className="relative mb-8">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full rounded-full border border-input bg-card py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          autoComplete="off"
        />
      </div>

      <CategoryFilterChips
        chips={categoryChips}
        activeId={categoryId ?? "all"}
        onSelect={(id) => setCategoryId(id === "all" ? undefined : id)}
        className="mb-10"
        scrollable
        isLoading={categoriesPending && categories === undefined}
      />

      {showInitialLoader ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : productsQuery.isPending ? (
        <div className="flex justify-center py-16">
          <InlineLoader text="Ürünler yükleniyor..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-xl border border-border bg-card/50 px-4 py-12 text-center text-muted-foreground">
          {search.trim()
            ? "Aramanızla eşleşen ürün bulunamadı."
            : "Bu kategoride henüz ürün yok veya liste boş."}
        </p>
      ) : (
        <ProductGrid
          products={filteredProducts}
          categoryNameById={categoryNameById}
          className="grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4"
        />
      )}
    </div>
  );
}
