"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import {
  buildOrderPayload,
  isCheckoutFormValid,
} from "@/lib/checkout/checkout-utils";
import { createOrder } from "@/lib/orders-api";
import { markOrderSuccess } from "@/lib/order-success";
import { formatTry } from "@/lib/format-try";
import {
  initialCheckoutForm,
  type CheckoutFormState,
} from "@/types/checkout";

export function useCheckout() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { items, itemCount, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutFormState>(initialCheckoutForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, isAuthLoading, router]);

  const totalText = useMemo(() => formatTry(totalPrice), [totalPrice]);
  const canSubmit =
    items.length > 0 && isCheckoutFormValid(form) && !isSubmitting;

  function updateField<K extends keyof CheckoutFormState>(
    key: K,
    value: CheckoutFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (formError) setFormError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setFormError("");
    setIsSubmitting(true);

    try {
      await createOrder(buildOrderPayload(form, items));
      clearCart();
      markOrderSuccess();
      router.replace("/");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Sipariş oluşturulamadı."
      );
      setIsSubmitting(false);
    }
  }

  return {
    user,
    isAuthLoading,
    items,
    itemCount,
    form,
    formError,
    isSubmitting,
    totalText,
    canSubmit,
    updateField,
    handleSubmit,
  };
}
