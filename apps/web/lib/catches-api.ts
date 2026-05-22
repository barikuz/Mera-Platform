import { supabase } from "./supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export interface CreateCatchPayload {
  species_id: string;
  length_cm?: number;
  weight_kg?: number;
  location_lat?: number;
  location_lng?: number;
}

export interface FishSpeciesCatalogItem {
  id: string;
  name: string;
}

export async function fetchFishSpeciesCatalog(): Promise<FishSpeciesCatalogItem[]> {
  const response = await fetch(`${API_BASE}/catalog/fish-species`);
  if (!response.ok) {
    throw new Error("Failed to fetch fish species catalog");
  }
  const data = await response.json();
  return data || [];
}

export async function createCatch(payload: CreateCatchPayload): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
  }

  const response = await fetch(`${API_BASE}/catches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Av kaydı oluşturulamadı. Lütfen tekrar deneyin."
    );
  }
}
