import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CheckoutEmptyCart() {
  return (
    <div className="mx-auto max-w-lg px-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Ödeme</h1>
      <p className="mt-3 text-muted-foreground">
        Sepetiniz boş. Ödeme yapmak için önce mağazadan ürün ekleyin.
      </p>
      <Button asChild className="mt-6">
        <Link href="/store">Mağazaya Git</Link>
      </Button>
    </div>
  );
}
