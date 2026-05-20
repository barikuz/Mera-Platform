import { supabase } from "@/lib/supabase";
import type { CreateOrderPayload, CreateOrderResponse } from "@/types/order";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = `Sipariş isteği başarısız (${response.status})`;
    try {
      const json = text ? (JSON.parse(text) as { message?: string | string[] }) : null;
      if (json?.message) {
        message = Array.isArray(json.message) ? json.message.join(", ") : json.message;
      } else if (text) {
        message = text;
      }
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error("Ödeme için giriş yapmanız gerekiyor.");
  }

  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<CreateOrderResponse>(response);
}
