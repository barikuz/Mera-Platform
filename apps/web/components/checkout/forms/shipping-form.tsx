import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckoutField } from "@/components/checkout/checkout-field";
import { digitsOnly } from "@/lib/checkout/checkout-utils";
import type { CheckoutFormState } from "@/types/checkout";

type ShippingFormProps = {
  form: CheckoutFormState;
  disabled: boolean;
  onFieldChange: <K extends keyof CheckoutFormState>(
    key: K,
    value: CheckoutFormState[K]
  ) => void;
};

export function ShippingForm({ form, disabled, onFieldChange }: ShippingFormProps) {
  return (
    <Card className="gap-4 py-5 shadow-sm">
      <CardHeader className="px-6 pb-0">
        <CardTitle className="text-lg">Teslimat Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckoutField
          id="shippingName"
          label="Ad Soyad"
          placeholder="Adınızı ve soyadınızı girin"
          value={form.shippingName}
          onChange={(v) => onFieldChange("shippingName", v)}
          disabled={disabled}
        />
        <CheckoutField
          id="shippingPhone"
          label="Telefon Numarası"
          placeholder="05xx xxx xx xx"
          value={form.shippingPhone}
          onChange={(v) => onFieldChange("shippingPhone", digitsOnly(v, 11))}
          inputMode="tel"
          disabled={disabled}
        />
        <CheckoutField
          id="shippingAddress"
          label="Adres"
          placeholder="Teslimat adresinizi girin"
          value={form.shippingAddress}
          onChange={(v) => onFieldChange("shippingAddress", v)}
          disabled={disabled}
          multiline
        />
      </CardContent>
    </Card>
  );
}
