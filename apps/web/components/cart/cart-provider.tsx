"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addCartItem,
  decrementCartItem,
  getItemCount,
  getTotalPrice,
  incrementCartItem,
  removeCartItem,
} from "@/lib/cart/cart-helpers";
import { getStoredCartItems, persistCartItems } from "@/lib/cart/cart-storage";
import type { CartContextValue, CartItem, CartProduct } from "@/types/cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getStoredCartItems);

  useEffect(() => {
    persistCartItems(items);
  }, [items]);

  const addItem = useCallback((product: CartProduct) => {
    setItems((prev) => addCartItem(prev, product));
  }, []);

  const increment = useCallback((productId: string) => {
    setItems((prev) => incrementCartItem(prev, productId));
  }, []);

  const decrement = useCallback((productId: string) => {
    setItems((prev) => decrementCartItem(prev, productId));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => removeCartItem(prev, productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = getItemCount(items);
    const totalPrice = getTotalPrice(items);

    return {
      items,
      itemCount,
      totalPrice,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
    };
  }, [addItem, clearCart, decrement, increment, items, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
}

export type { CartItem, CartProduct };
