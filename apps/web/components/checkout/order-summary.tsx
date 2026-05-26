import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toLinePrice } from "@/lib/checkout/checkout-utils";
import { formatTry } from "@/lib/format-try";
import type { CartItem } from "@/types/cart";

type OrderSummaryProps = {
  items: CartItem[];
  itemCount: number;
  totalText: string;
  formError: string;
  canSubmit: boolean;
  isSubmitting: boolean;
};

export function OrderSummary({
  items,
  itemCount,
  totalText,
  formError,
  canSubmit,
  isSubmitting,
}: OrderSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-28">
      <Card className="gap-4 py-5 shadow-sm">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-lg">Sipariş Özeti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-border/80 pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug">
                    {item.name ?? "Adsız ürün"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Adet: {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">
                  {formatTry(toLinePrice(item.price, item.quantity))}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Ürün</p>
              <p className="text-lg font-semibold">{itemCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Toplam Tutar</p>
              <p className="text-xl font-semibold">{totalText}</p>
            </div>
          </div>

          {formError ? (
            <div
              role="alert"
              className="rounded-lg border border-mera-status-error/30 bg-mera-status-error/10 px-4 py-3 text-sm text-mera-status-error"
            >
              {formError}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!canSubmit}
          >
            {isSubmitting ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
