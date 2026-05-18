/// <reference types="@types/google.maps" />
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, MapPin } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import {
  SpotDiscoveryMapModalProps,
  FishingSpot,
  LatLng,
} from "@/types/assistant";
import { ELAZIG_CENTER, MAPS_API_KEY } from "@/constants/assistant";
import { SpotMarkerPopup } from "./spot-marker-popup";

const BRAND_PIN_PROPS = {
  background: "var(--color-mera-primary)",
  borderColor: "var(--color-mera-primary)",
  glyphColor: "var(--color-mera-primary)",
} as const;

function useMapColorScheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const frameId = requestAnimationFrame(() => {
      setIsDark(root.classList.contains("dark"));
    });
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return isDark;
}

function spotsWithCoords(spots: FishingSpot[]): FishingSpot[] {
  return spots.filter(
    (s) => typeof s.lat === "number" && typeof s.lng === "number"
  );
}

function DiscoveryMapInterior({
  spots,
  onSelectSpot,
  onMapClick,
}: {
  spots: FishingSpot[];
  onSelectSpot: (id: string) => void;
  onMapClick: (e: MapMouseEvent) => void;
}) {
  const map = useMap();
  const isDark = useMapColorScheme();
  const validSpots = useMemo(() => spotsWithCoords(spots), [spots]);

  useEffect(() => {
    if (!map || validSpots.length === 0) return;

    if (validSpots.length === 1) {
      const spot = validSpots[0];
      map.setCenter({ lat: spot.lat!, lng: spot.lng! });
      map.setZoom(13);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    validSpots.forEach((spot) => {
      bounds.extend({ lat: spot.lat!, lng: spot.lng! });
    });
    map.fitBounds(bounds, { top: 80, bottom: 160, left: 40, right: 40 });
  }, [map, validSpots]);

  const defaultCenter: LatLng =
    validSpots.length > 0
      ? { lat: validSpots[0].lat!, lng: validSpots[0].lng! }
      : ELAZIG_CENTER;

  return (
    <Map
      defaultCenter={defaultCenter}
      defaultZoom={10}
      mapId="spot-discovery-modal-map"
      colorScheme={isDark ? "DARK" : "LIGHT"}
      gestureHandling="greedy"
      disableDefaultUI={false}
      onClick={onMapClick}
      className="w-full h-full"
    >
      {validSpots.map((spot) => (
        <AdvancedMarker
          key={spot.id}
          position={{ lat: spot.lat!, lng: spot.lng! }}
          onClick={(e) => {
            console.log("Marker clicked:");
            e.domEvent.stopPropagation();
            onSelectSpot(spot.id);
          }}
        >
          
        </AdvancedMarker>
      ))}
    </Map>
  );
}

export function SpotDiscoveryMapModal({
  isOpen,
  spots,
  onClose,
}: SpotDiscoveryMapModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const selectedSpot = useMemo(
    () => spots.find((s) => s.id === selectedSpotId) ?? null,
    [spots, selectedSpotId]
  );

  const handleClose = useCallback(() => {
    setSelectedSpotId(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => closeRef.current?.focus(), 50);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) handleClose();
    },
    [handleClose]
  );

  const handleMapClick = useCallback(() => {
    setSelectedSpotId(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mera Keşfi"
      onClick={handleBackdropClick}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        animate-in fade-in-0 duration-200
      "
    >
      <div
        className="
          relative flex flex-col
          w-full max-w-3xl mx-4
          bg-white dark:bg-zinc-900
          rounded-2xl shadow-2xl shadow-black/40
          overflow-hidden
          animate-in zoom-in-95 duration-200
        "
        style={{ height: "min(90vh, 680px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-zinc-700 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <h2 className="text-sm font-semibold text-foreground dark:text-zinc-100 truncate">
              Mera Keşfi
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            aria-label="Modalı kapat"
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              text-muted-foreground hover:text-foreground
              hover:bg-secondary dark:hover:bg-zinc-700
              transition-colors duration-150 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex-1 min-h-0">
          <APIProvider apiKey={MAPS_API_KEY}>
            <DiscoveryMapInterior
              spots={spots}
              onSelectSpot={setSelectedSpotId}
              onMapClick={handleMapClick}
            />
          </APIProvider>

          {selectedSpot && (
            <SpotMarkerPopup
              spot={selectedSpot}
              onDeselect={() => setSelectedSpotId(null)}
            />
          )}
        </div>

        <div className="flex-shrink-0 px-4 py-3 border-t border-border dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={handleClose}
            className="
              w-full h-10 rounded-lg
              bg-primary text-primary-foreground
              text-sm font-semibold
              transition-all duration-150
              hover:opacity-90 active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              cursor-pointer
            "
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
