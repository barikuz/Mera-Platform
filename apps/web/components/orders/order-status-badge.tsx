import { cn } from "@/lib/utils";

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Beklemede",
    className:
      "border-mera-status-warning/40 bg-mera-status-warning/10 text-mera-status-warning",
  },
  processing: {
    label: "İşleniyor",
    className:
      "border-mera-status-info/40 bg-mera-status-info/10 text-mera-status-info",
  },
  shipped: {
    label: "Kargoda",
    className:
      "border-primary/40 bg-primary/10 text-primary dark:text-mera-accent",
  },
  delivered: {
    label: "Teslim Edildi",
    className:
      "border-mera-status-success/40 bg-mera-status-success/10 text-mera-status-success",
  },
  cancelled: {
    label: "İptal Edildi",
    className:
      "border-mera-status-error/40 bg-mera-status-error/10 text-mera-status-error",
  },
};

function getStatus(status: string) {
  return (
    STATUS_MAP[status] ?? {
      label: status,
      className: "border-border bg-secondary text-secondary-foreground",
    }
  );
}

// ── Component ──────────────────────────────────────────────────────────────

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, className } = getStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
    >
      {label}
    </span>
  );
}
