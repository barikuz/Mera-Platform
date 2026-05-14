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
