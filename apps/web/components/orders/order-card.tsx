import Image from "next/image";
import { CalendarDays, MapPin, Package, Phone, ShoppingBag, User } from "lucide-react";
import { formatTry } from "@/lib/format-try";
import { formatDateTime } from "@/lib/format-date";
import type { Order } from "@/lib/orders-api";
import { OrderStatusBadge } from "./order-status-badge";

// ── Component ──────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  index: number;
}

export function OrderCard({ order, index }: OrderCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border bg-secondary/20 dark:bg-mera-neutral-800/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20 shrink-0">
            <Package className="h-4 w-4 text-primary dark:text-mera-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sipariş #{index + 1}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CalendarDays className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {formatDateTime(order.created_at)}
              </p>
            </div>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Shipping info */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-border">
        <ShippingField icon={<User className="h-4 w-4" />} label="Alıcı" value={order.shipping_name} />
        <ShippingField icon={<Phone className="h-4 w-4" />} label="Telefon" value={order.shipping_phone} />
        <ShippingField icon={<MapPin className="h-4 w-4" />} label="Adres" value={order.shipping_address} />
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-2">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0"
          >
            {/* Thumbnail + name */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover border border-border bg-secondary/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg border border-border bg-secondary/50 dark:bg-mera-neutral-800 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                )}
                {/* Quantity badge */}
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
                  {item.quantity}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {item.product_name}
              </p>
            </div>

            {/* Line total */}
            <p className="text-sm font-semibold text-foreground whitespace-nowrap">
              {formatTry(item.unit_price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="px-5 py-3 flex justify-end border-t border-border bg-secondary/10 dark:bg-mera-neutral-800/20">
        <p className="text-sm text-muted-foreground mr-3">Toplam</p>
        <p className="text-base font-bold text-foreground">
          {formatTry(order.total_amount)}
        </p>
      </div>
    </div>
  );
}

// ── Private sub-component ──────────────────────────────────────────────────

function ShippingField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm text-foreground leading-snug">{value}</p>
      </div>
    </div>
  );
}
