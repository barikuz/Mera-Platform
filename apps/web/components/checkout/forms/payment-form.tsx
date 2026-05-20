import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckoutField } from "@/components/checkout/checkout-field";
import { digitsOnly } from "@/lib/checkout/checkout-utils";
import type { CheckoutFormState } from "@/types/checkout";

type PaymentFormProps = {
  form: CheckoutFormState;
  disabled: boolean;
  onFieldChange: <K extends keyof CheckoutFormState>(
    key: K,
    value: CheckoutFormState[K]
  ) => void;
};

export function PaymentForm({ form, disabled, onFieldChange }: PaymentFormProps) {
  return (
    <Card className="gap-4 py-5 shadow-sm">
      <CardHeader className="px-6 pb-0">
        <CardTitle className="text-lg">Ödeme Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckoutField
          id="cardHolderName"
          label="Kart Sahibinin Adı"
          placeholder="Kart üzerindeki adı girin"
          value={form.cardHolderName}
          onChange={(v) => onFieldChange("cardHolderName", v)}
          disabled={disabled}
        />
        <CheckoutField
          id="cardNumber"
          label="Kart Numarası"
          placeholder="16 haneli kart numarası"
          value={form.cardNumber}
          onChange={(v) => onFieldChange("cardNumber", digitsOnly(v, 19))}
          inputMode="numeric"
          disabled={disabled}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <CheckoutField
            id="expireMonth"
            label="Son Kullanma Ay"
            placeholder="AA"
            value={form.expireMonth}
            onChange={(v) => onFieldChange("expireMonth", digitsOnly(v, 2))}
            inputMode="numeric"
            disabled={disabled}
          />
          <CheckoutField
            id="expireYear"
            label="Son Kullanma Yıl"
            placeholder="YYYY"
            value={form.expireYear}
            onChange={(v) => onFieldChange("expireYear", digitsOnly(v, 4))}
            inputMode="numeric"
            disabled={disabled}
          />
          <CheckoutField
            id="cvc"
            label="CVC"
            placeholder="***"
            value={form.cvc}
            onChange={(v) => onFieldChange("cvc", digitsOnly(v, 4))}
            inputMode="numeric"
            secret
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
