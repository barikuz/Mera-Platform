import { Sparkles, Wrench, Lightbulb } from "lucide-react";
import { TabConfig, FishingSpot, LatLng } from "@/types/assistant";

export const TABS: TabConfig[] = [
  {
    id: "recommendation",
    label: "Mera Önerisi",
    icon: Sparkles,
    description: "Yapay zeka destekli balık avı önerileri al",
  },
  {
    id: "equipment",
    label: "Ekipman Tavsiyesi",
    icon: Wrench,
    description: "Koşullara göre en iyi ekipmanı keşfet",
  },
  {
    id: "tips",
    label: "Teknik İpuçları",
    icon: Lightbulb,
    description: "Deneyimli balıkçılardan teknikler öğren",
  },
];

export const FISH_SPECIES = [
  "Levrek",
  "Çipura",
  "Kefal",
  "Lüfer",
  "Palamut",
  "Uskumru",
  "İstavrit",
  "Hamsi",
  "Sardalya",
  "Barbun",
  "Tekir",
  "Kolyoz",
  "Dil Balığı",
  "Kalkan",
];

export const FISHING_STYLES = [
  "Kıyı",
  "Tekne",
  "Spin",
  "Uçkur",
  "Dip",
  "Surf Casting",
  "Fly Fishing",
  "Jigging",
];

export const FISHING_SPOTS: FishingSpot[] = [
  { id: "1", label: "Bosphorus — İstanbul", region: "Marmara" },
  { id: "2", label: "Erdek Körfezi — Balıkesir", region: "Marmara" },
  { id: "3", label: "Çeşme Yarımadası — İzmir", region: "Ege" },
  { id: "4", label: "Antalya Körfezi — Antalya", region: "Akdeniz" },
];

export const ELAZIG_CENTER: LatLng = { lat: 38.6748, lng: 39.2226 };
export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
