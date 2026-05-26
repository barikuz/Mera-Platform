"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchShopCategories } from "@/lib/shop-api";
import { buildCategoryNameMap } from "@/lib/shop-utils";

export function useShopCategories() {
  const query = useQuery({
    queryKey: ["shop", "categories"],
    queryFn: fetchShopCategories,
  });

  const categoryNameById = useMemo(
    () => buildCategoryNameMap(query.data ?? []),
    [query.data]
  );

  return { ...query, categoryNameById };
}
