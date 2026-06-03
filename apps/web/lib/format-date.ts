/**
 * Formats an ISO date string as a long Turkish date+time.
 * Example: "3 Haziran 2026 17:30"
 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats an ISO date string as a short Turkish date (day + abbreviated month).
 * Example: "3 Haz"
 */
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}
