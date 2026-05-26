"use client";

import { CheckoutEmptyCart } from "@/components/checkout/checkout-empty-cart";
import { PaymentForm } from "@/components/checkout/forms/payment-form";
import { ShippingForm } from "@/components/checkout/forms/shipping-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { FullScreenSpinner } from "@/components/ui/spinner";
import { useCheckout } from "@/hooks/use-checkout";

export function CheckoutView() {
  const {
    user,
    isAuthLoading,
    isCartHydrated,
    items,
    itemCount,
    form,
    formError,
    isSubmitting,
    totalText,
    canSubmit,
    updateField,
    handleSubmit,
  } = useCheckout();

  if (isAuthLoading || !user || !isCartHydrated) {
    return <FullScreenSpinner />;
  }

  if (items.length === 0) {
    return <CheckoutEmptyCart />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-semibold text-foreground sm:text-3xl">
        Ödeme
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"
      >
        <div className="space-y-6">
          <ShippingForm
            form={form}
            disabled={isSubmitting}
            onFieldChange={updateField}
          />
          <PaymentForm
            form={form}
            disabled={isSubmitting}
            onFieldChange={updateField}
          />
        </div>

        <OrderSummary
          items={items}
          itemCount={itemCount}
          totalText={totalText}
          formError={formError}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
