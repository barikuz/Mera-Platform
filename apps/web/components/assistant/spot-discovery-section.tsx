"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { FishingSpot, LatLng } from "@/types/assistant";
import { ELAZIG_CENTER, MAPS_API_KEY } from "@/constants/assistant";
import { SpotDiscoveryMapModal } from "./spot-discovery-map-modal";

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

function PreviewMapInterior({ center }: { center: LatLng }) {
  const map = useMap();
  const isDark = useMapColorScheme();

  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  return (
    <Map
      defaultCenter={center}
      defaultZoom={13}
      mapId="spot-discovery-preview"
      colorScheme={isDark ? "DARK" : "LIGHT"}
      gestureHandling="none"
      disableDefaultUI={true}
      clickableIcons={false}
      className="w-full h-full pointer-events-none"
    >
      <AdvancedMarker position={center}>
        <Pin {...BRAND_PIN_PROPS} />
      </AdvancedMarker>
    </Map>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface SpotDiscoverySectionProps {
  spots: FishingSpot[];
  isLoading?: boolean;
}

export function SpotDiscoverySection({
  spots,
  isLoading,
}: SpotDiscoverySectionProps) {
  const isClient = useIsClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCenter, setUserCenter] = useState<LatLng>(ELAZIG_CENTER);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { timeout: 10000 }
    );
  }, []);

  return (
    <>
      <section className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-2.5 mb-2">
          <Search className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="text-lg font-bold text-foreground">Mera Keşfi</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Bölgenizdeki en verimli balık tutma noktalarını harita üzerinden
          keşfedin ve yeni meralar bulun.
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          aria-label="Mera Keşfi haritasını aç"
          className="
            relative w-full h-44 sm:h-52 md:h-56
            rounded-2xl overflow-hidden border border-border shadow-sm
            cursor-pointer transition-shadow duration-200
            hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          <div className="absolute inset-0 pointer-events-none">
            {isClient ? (
              <APIProvider apiKey={MAPS_API_KEY}>
                <PreviewMapInterior center={userCenter} />
              </APIProvider>
            ) : (
              <div className="h-full w-full bg-muted/30" aria-hidden />
            )}
          </div>
        </button>
      </section>

      <SpotDiscoveryMapModal
        isOpen={isModalOpen}
        spots={spots}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
