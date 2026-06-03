"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Header } from "@/components/landing/header";
import { FullScreenSpinner, Spinner } from "@/components/ui/spinner";
import { OrderCard } from "@/components/orders/order-card";

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data: orders, isLoading, isError } = useOrders(!!user && !authLoading);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page heading */}
        <div className="mb-10 flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <ShoppingBag className="h-6 w-6 text-primary dark:text-mera-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Siparişlerim
            </h1>
            {!isLoading && orders && (
              <p className="text-sm text-muted-foreground mt-1">
                Toplam {orders.length} sipariş
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-base font-medium text-foreground">
              Siparişler yüklenemedi
            </p>
            <p className="text-sm text-muted-foreground">
              Bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
          </div>
        ) : !orders?.length ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary dark:bg-mera-neutral-800 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-base font-medium text-foreground">
              Henüz sipariş vermediniz
            </p>
            <p className="text-sm text-muted-foreground">
              Mağazamızı keşfedin ve ilk siparişinizi oluşturun.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => (
              <OrderCard key={i} order={order} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
