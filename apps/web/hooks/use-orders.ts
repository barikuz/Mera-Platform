"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/orders-api";

/**
 * Oturum açmış kullanıcının siparişlerini getirir.
 * Sadece oturum açıkken etkinleşir.
 */
export function useOrders(enabled = true) {
  return useQuery({
    queryKey: ["orders", "my"],
    queryFn: fetchOrders,
    enabled,
    staleTime: 60 * 1000,
  });
}
