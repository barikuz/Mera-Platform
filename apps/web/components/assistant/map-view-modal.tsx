"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, MapPin } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapViewModalProps, LatLng } from "@/types/assistant";
import { MAPS_API_KEY } from "@/constants/assistant";

// ─── Inner map component (read-only, no click handler) ────────────────────────

function ReadOnlyMapInterior({ coords }: { coords: LatLng }) {
  const map = useMap();
  const [isDark, setIsDark] = useState(false);

  // Sync theme with document root class
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

  // Pan to coordinates when map loads
  useEffect(() => {
    if (map && coords) {
      map.panTo(coords);
    }
  }, [map, coords]);

  return (
    <Map
      defaultCenter={coords}
      defaultZoom={13}
      mapId="mera-map-view"
      colorScheme={isDark ? "DARK" : "LIGHT"}
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="w-full h-full"
    >
      <AdvancedMarker position={coords}>
        <Pin
          background="var(--color-mera-primary)"
          borderColor="var(--color-mera-primary)"
          glyphColor="var(--color-mera-primary)"
        />
      </AdvancedMarker>
    </Map>
  );
}

// ─── Read-Only Map Modal ──────────────────────────────────────────────────────
// Reuses the same modal shell pattern as MapPickerModal but without
// click-to-select, locate-me, or save functionality.

export function MapViewModal({
  isOpen,
  coords,
  label,
  onClose,
}: MapViewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => closeRef.current?.focus(), 50);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
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
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} konumu`}
      onClick={handleBackdropClick}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        animate-in fade-in-0 duration-200
      "
    >
      {/* Modal panel */}
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
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-zinc-700 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <h2 className="text-sm font-semibold text-foreground dark:text-zinc-100 truncate">
              {label}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
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

        {/* Map area (read-only) */}
        <div className="relative flex-1 min-h-0">
          <APIProvider apiKey={MAPS_API_KEY}>
            <ReadOnlyMapInterior coords={coords} />
          </APIProvider>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-border dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={onClose}
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
