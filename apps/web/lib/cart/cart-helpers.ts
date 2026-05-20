import type { CartItem, CartProduct } from "@/types/cart";

export function addCartItem(items: CartItem[], product: CartProduct): CartItem[] {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...items, { ...product, quantity: 1 }];
}

export function incrementCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.map((item) =>
    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
  );
}

export function decrementCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.flatMap((item) => {
    if (item.id !== productId) return [item];
    if (item.quantity <= 1) return [];
    return [{ ...item, quantity: item.quantity - 1 }];
  });
}

export function removeCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + toNumber(item.price) * item.quantity, 0);
}

function toNumber(price: number | string | null | undefined): number {
  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }
  if (typeof price === "string") {
    const parsed = Number.parseFloat(price);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
