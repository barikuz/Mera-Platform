export const ORDER_SUCCESS_STORAGE_KEY = "mera-order-success";

export function markOrderSuccess(): void {
  try {
    sessionStorage.setItem(ORDER_SUCCESS_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasPendingOrderSuccess(): boolean {
  try {
    return sessionStorage.getItem(ORDER_SUCCESS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearOrderSuccess(): void {
  try {
    sessionStorage.removeItem(ORDER_SUCCESS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
