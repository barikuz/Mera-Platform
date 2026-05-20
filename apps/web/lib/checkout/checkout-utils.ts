import type { CartItem } from "@/types/cart";
import type { CheckoutFormState } from "@/types/checkout";
import type { CreateOrderPayload } from "@/types/order";

export function toLinePrice(
  price: number | string | null,
  quantity: number
): number {
  const n =
    typeof price === "string" ? Number.parseFloat(price) : Number(price ?? 0);
  return (Number.isFinite(n) ? n : 0) * quantity;
}

export function digitsOnly(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, "");
  return maxLength ? digits.slice(0, maxLength) : digits;
}

export function isCheckoutFormValid(form: CheckoutFormState): boolean {
  const cardNumber = digitsOnly(form.cardNumber);
  const month = form.expireMonth.padStart(2, "0").slice(-2);
  const year = form.expireYear.trim();
  const cvc = digitsOnly(form.cvc);

  return (
    form.shippingName.trim().length > 0 &&
    form.shippingPhone.trim().length >= 10 &&
    form.shippingAddress.trim().length > 0 &&
    form.cardHolderName.trim().length > 0 &&
    /^\d{12,19}$/.test(cardNumber) &&
    /^(0[1-9]|1[0-2])$/.test(month) &&
    /^\d{2}(\d{2})?$/.test(year) &&
    /^\d{3,4}$/.test(cvc)
  );
}

export function buildOrderPayload(
  form: CheckoutFormState,
  items: CartItem[]
): CreateOrderPayload {
  return {
    shippingName: form.shippingName.trim(),
    shippingPhone: form.shippingPhone.trim(),
    shippingAddress: form.shippingAddress.trim(),
    items: items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    paymentCard: {
      cardHolderName: form.cardHolderName.trim(),
      cardNumber: digitsOnly(form.cardNumber),
      expireMonth: form.expireMonth.padStart(2, "0").slice(-2),
      expireYear: form.expireYear.trim(),
      cvc: digitsOnly(form.cvc),
    },
  };
}
