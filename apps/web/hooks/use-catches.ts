"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCatches } from "@/lib/catches-api";

/**
 * Oturum açmış kullanıcının av kayıtlarını getirir.
 * Sadece oturum açıkken etkinleşir.
 */
export function useCatches(enabled = true) {
  return useQuery({
    queryKey: ["catches", "my"],
    queryFn: fetchCatches,
    enabled,
    staleTime: 30 * 1000,
  });
}
