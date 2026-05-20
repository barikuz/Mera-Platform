import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "mera-cart-items";

export function getStoredCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? parseStoredItems(stored) : [];
}

export function persistCartItems(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function parseStoredItems(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        id: typeof item?.id === "string" ? item.id : "",
        name: typeof item?.name === "string" ? item.name : null,
        price:
          typeof item?.price === "number" || typeof item?.price === "string"
            ? item.price
            : null,
        image_url: typeof item?.image_url === "string" ? item.image_url : null,
        quantity:
          typeof item?.quantity === "number" && item.quantity > 0
            ? Math.floor(item.quantity)
            : 0,
      }))
      .filter((item) => item.id && item.quantity > 0);
  } catch {
    return [];
  }
}
