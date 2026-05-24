import { supabase } from "./supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export interface CreateCatchPayload {
  species_id: string;
  length_cm?: number;
  weight_kg?: number;
  location_lat?: number;
  location_lng?: number;
}

export interface CatchRecord {
  id: string;
  user_id: string;
  species_id: string;
  weight_kg: number | null;
  length_cm: number | null;
  location_lat: number | null;
  location_lng: number | null;
  weather_temp_c: number | null;
  weather_pressure_hpa: number | null;
  weather_wind_speed_kmh: number | null;
  created_at: string;
  updated_at?: string | null;
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

export async function fetchCatches(): Promise<CatchRecord[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
  }

  const response = await fetch(`${API_BASE}/catches`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Av kayıtları alınamadı. Lütfen tekrar deneyin."
    );
  }

  const json = await response.json();
  return (json?.data ?? []) as CatchRecord[];
}
