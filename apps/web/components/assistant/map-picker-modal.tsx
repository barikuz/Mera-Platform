"use client";

import { useEffect, useState } from "react";
import { X, Navigation, MapPin } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useMapPicker } from "@/hooks/use-map-picker";
import { MapPickerModalProps, MapInteriorProps } from "@/types/assistant";
import { ELAZIG_CENTER, MAPS_API_KEY } from "@/constants/assistant";

// ─── Inner map component (needs map context) ─────────────────────────────────

function MapInterior({
  markerPos,
  onMapClick,
  onLocateMe,
  isLocating,
}: MapInteriorProps) {
  const map = useMap();
  const [isDark, setIsDark] = useState(false);

  // Sync initial theme and listen for changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Avoid synchronous setState to prevent cascading renders
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

  // When markerPos changes externally (e.g. locate-me), pan the map there
  useEffect(() => {
    if (map && markerPos) {
      map.panTo(markerPos);
    }
  }, [map, markerPos]);

  return (
    <>
      <Map
        defaultCenter={ELAZIG_CENTER}
        defaultZoom={12}
        mapId="mera-map-picker"
        colorScheme={isDark ? "DARK" : "LIGHT"}
        onClick={onMapClick}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full"
      >
        {markerPos && (
          <AdvancedMarker position={markerPos}>
          <Pin
            background="var(--color-mera-primary)"
            borderColor="var(--color-mera-primary)"
            glyphColor="var(--color-mera-primary)"
          />
          </AdvancedMarker>
        )}
      </Map>

      {/* Floating "Konumumu Kullan" button */}
      <button
        type="button"
        onClick={onLocateMe}
        disabled={isLocating}
        aria-label="Mevcut konumumu kullan"
        className="
          absolute top-3 right-3 z-10
          flex items-center gap-2 px-3 py-2
          bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100
          text-sm font-medium rounded-lg
          shadow-md shadow-black/20
          border border-zinc-200 dark:border-zinc-600
          hover:bg-zinc-50 dark:hover:bg-zinc-700
          transition-all duration-150 cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        <Navigation
          className={`w-4 h-4 text-primary flex-shrink-0 ${isLocating ? "animate-spin" : ""}`}
        />
        <span>{isLocating ? "Alınıyor…" : "Konumumu Kullan"}</span>
      </button>
    </>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function MapPickerModal({
  isOpen,
  initialCoords,
  onClose,
  onSave,
}: MapPickerModalProps) {
  const {
    markerPos,
    isLocating,
    overlayRef,
    firstFocusRef,
    handleMapClick,
    handleLocateMe,
    handleSaveClick,
    handleBackdropClick,
  } = useMapPicker(isOpen, onClose, onSave, initialCoords);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Haritadan konum seç"
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
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground dark:text-zinc-100">
              Haritadan Konum Seç
            </h2>
          </div>
          <button
            ref={firstFocusRef}
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

        {/* Map area */}
        <div className="relative flex-1 min-h-0">
          <APIProvider apiKey={MAPS_API_KEY}>
            <MapInterior
              markerPos={markerPos}
              onMapClick={handleMapClick}
              onLocateMe={handleLocateMe}
              isLocating={isLocating}
            />
          </APIProvider>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-border dark:border-zinc-700 space-y-3 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={!markerPos}
            className="
              w-full h-10 rounded-lg
              bg-primary text-primary-foreground
              text-sm font-semibold
              transition-all duration-150
              hover:opacity-90 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              cursor-pointer
            "
          >
            Kaydet
          </button>
          <p className="text-xs text-center text-muted-foreground dark:text-zinc-500">
            Haritada bir noktaya dokunun ya da mevcut konumunuzu kullanın.
          </p>
        </div>
      </div>
    </div>
  );
}
