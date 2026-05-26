import { MapMouseEvent } from "@vis.gl/react-google-maps";

export type TabId = "recommendation" | "equipment" | "tips";

export interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

export interface FishingSpot {
  id: string;
  label: string;
  region: string;
  lat?: number;
  lng?: number;
  description?: string;
  minDepth?: number;
  maxDepth?: number;
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  pressure: number;
}

export interface SpotDiscoveryMapModalProps {
  isOpen: boolean;
  spots: FishingSpot[];
  onClose: () => void;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapPickerModalProps {
  isOpen: boolean;
  initialCoords?: LatLng | null;
  onClose: () => void;
  onSave: (coords: LatLng) => void;
}

export interface MapInteriorProps {
  markerPos: LatLng | null;
  onMapClick: (e: MapMouseEvent) => void;
  onLocateMe: () => void;
  isLocating: boolean;
}

// ─── Result Types ─────────────────────────────────────────────────────────────

export interface SpotResult {
  spotName: string;
  waterType: string;
  depth: string;
  description: string;
  coordinates: LatLng;
}

export interface EquipmentResult {
  productId?: string;
  category: "Kamış" | "Makine" | "Yem / Sahte Yem";
  productName: string;
  price: number;
  expertNote: string;
  image_url?: string | null;
}

export interface TipResult {
  title: string;
  subtitle: string;
  items: string[];
}

export type ResultStatus = "idle" | "loading" | "success" | "error";

export interface FilterTag {
  emoji: string;
  label: string;
}

export interface MapViewModalProps {
  isOpen: boolean;
  coords: LatLng;
  label: string;
  onClose: () => void;
}
