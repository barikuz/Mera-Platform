export function formatTry(price: number | string | null | undefined): string {
  const n = typeof price === "string" ? Number.parseFloat(price) : price;
  if (n == null || Number.isNaN(Number(n))) {
    return "—";
  }
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(Number(n));
}
