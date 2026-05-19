"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineLoader, Spinner } from "@/components/ui/spinner";
import { ProductCard } from "@/components/store/product-card";
import { fetchShopCategories, fetchShopProducts } from "@/lib/shop-api";

export function StoreView() {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["shop", "categories"],
    queryFn: fetchShopCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["shop", "products", categoryId ?? "all"],
    queryFn: () => fetchShopProducts(categoryId),
  });

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categoriesQuery.data ?? []) {
      if (c.id && c.name) {
        map.set(c.id, c.name);
      }
    }
    return map;
  }, [categoriesQuery.data]);

  const filteredProducts = useMemo(() => {
    const list = productsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => (p.name ?? "").toLowerCase().includes(q));
  }, [productsQuery.data, search]);

  const categoriesError = categoriesQuery.isError;
  const productsError = productsQuery.isError;
  const showInitialLoader =
    (categoriesQuery.isPending || productsQuery.isPending) &&
    !categoriesQuery.isFetched &&
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
          {categoriesQuery.error instanceof Error
            ? categoriesQuery.error.message
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

      <div className="-mx-1 mb-10 overflow-x-auto px-1 pb-1">
        <div className="flex w-max min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
          <Button
            type="button"
            variant={categoryId === undefined ? "default" : "outline"}
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => setCategoryId(undefined)}
          >
            Tümü
          </Button>
          {categoriesQuery.isPending && categoriesQuery.data === undefined ? (
            <div className="flex items-center px-2">
              <InlineLoader text="Kategoriler..." />
            </div>
          ) : (
            (categoriesQuery.data ?? []).map((cat) => (
              <Button
                key={cat.id}
                type="button"
                variant={categoryId === cat.id ? "default" : "outline"}
                size="sm"
                className="shrink-0 rounded-full"
                onClick={() => setCategoryId(cat.id)}
              >
                {cat.name ?? "Kategori"}
              </Button>
            ))
          )}
        </div>
      </div>

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
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
}
