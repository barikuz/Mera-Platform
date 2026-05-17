import { SpotResult, EquipmentResult, TipResult, FishingSpot } from "@/types/assistant";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export interface SpotRecommendationRequest {
  targetFish: string;
  coordinates: { lat: number; lng: number };
}

export interface GearRecommendationRequest {
  targetFish: string;
  coordinates: { lat: number; lng: number };
  fishingStyle: string;
}

export interface TechnicalTipsRequest {
  targetFish: string;
  coordinates: { lat: number; lng: number };
}

interface RawSpotItem {
  meraAdi: string;
  suTipi: string;
  derinlik: string;
  aciklama: string;
  koordinat: { lat: number; lng: number };
}

interface RawGearItem {
  productId?: string;
  kategori: "Kamış" | "Makine" | "Yem / Sahte Yem";
  urunAdi: string;
  fiyat: number;
  uzmanNotu: string;
}

interface RawTipItem {
  baslik: string;
  altBaslik: string;
  maddeler: string[];
}

export async function fetchSpotRecommendation(
  req: SpotRecommendationRequest
): Promise<SpotResult[]> {
  const response = await fetch(`${API_BASE}/spot-recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch spot recommendations");
  }

  const data = await response.json();
  const rawItems: RawSpotItem[] = data.onerilen_meralar || [];

  return rawItems.map((item) => ({
    spotName: item.meraAdi || "",
    waterType: item.suTipi || "",
    depth: item.derinlik || "",
    description: item.aciklama || "",
    coordinates: item.koordinat || { lat: 0, lng: 0 },
  }));
}

export async function fetchGearRecommendation(
  req: GearRecommendationRequest
): Promise<EquipmentResult[]> {
  const response = await fetch(`${API_BASE}/gear-recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gear recommendations");
  }

  const data = await response.json();
  const rawItems: RawGearItem[] = data.onerilen_set || [];

  return rawItems.map((item) => ({
    productId: item.productId,
    category: item.kategori,
    productName: item.urunAdi || "",
    price: item.fiyat || 0,
    expertNote: item.uzmanNotu || "",
  }));
}

export async function fetchTechnicalTips(
  req: TechnicalTipsRequest
): Promise<TipResult[]> {
  const response = await fetch(`${API_BASE}/technical-tips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch technical tips");
  }

  const data = await response.json();
  const rawItems: RawTipItem[] = data.taktikler || [];

  return rawItems.map((item) => ({
    title: item.baslik || "",
    subtitle: item.altBaslik || "",
    items: item.maddeler || [],
  }));
}

export interface ApiFishingSpot {
  id: string;
  name: string;
  water_type: string;
  center_lat: number;
  center_lng: number;
}

export async function fetchFishingSpots(): Promise<FishingSpot[]> {
  const response = await fetch(`${API_BASE}/fishing-spots`);
  if (!response.ok) {
    throw new Error("Failed to fetch fishing spots");
  }

  const data = await response.json();
  const rawSpots: ApiFishingSpot[] = data.data || [];

  return rawSpots.map((spot) => ({
    id: spot.id,
    label: spot.name,
    region: spot.water_type,
    lat: spot.center_lat,
    lng: spot.center_lng,
  }));
}

export async function fetchFishSpecies(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/catalog/fish-species`);
  if (!response.ok) {
    throw new Error("Failed to fetch fish species");
  }
  const data = await response.json();
  return (data || []).map((item: { id: string; name: string }) => item.name);
}

export async function fetchFishingStyles(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/catalog/fishing-styles`);
  if (!response.ok) {
    throw new Error("Failed to fetch fishing styles");
  }
  const data = await response.json();
  return (data || []).map((item: { id: string; name: string }) => item.name);
}
