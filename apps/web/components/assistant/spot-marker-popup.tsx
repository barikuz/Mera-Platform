"use client";

import { Activity, Thermometer, Waves, Wind, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FishingSpot } from "@/types/assistant";
import { fetchWeather, formatDepthRange } from "@/lib/assistant-api";

interface SpotMarkerPopupProps {
  spot: FishingSpot;
  onDeselect: () => void;
}

function WeatherMetric({
  icon: Icon,
  iconClassName,
  value,
  label,
}: {
  icon: React.ElementType;
  iconClassName: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <Icon className={`h-5 w-5 ${iconClassName}`} />
      <span className="text-sm font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="flex gap-4 justify-between">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
          <div className="h-3 w-12 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function SpotMarkerPopup({ spot, onDeselect }: SpotMarkerPopupProps) {
  const lat = spot.lat;
  const lng = spot.lng;
  const hasCoords = lat != null && lng != null;

  const { data: weather, isLoading, isError } = useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchWeather(lat!, lng!),
    enabled: hasCoords,
    staleTime: 5 * 60 * 1000,
  });

  const depthLabel = formatDepthRange(spot.minDepth, spot.maxDepth);

  return (
    <>
      {/* Top info card */}
      <div className="absolute top-3 left-3 right-3 z-10 pointer-events-auto">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg">
          <h4 className="text-base font-bold text-foreground leading-snug mb-1">
            {spot.label}
          </h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-2">
            {spot.region}
          </span>
          {spot.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {spot.description}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Waves className="h-3.5 w-3.5" />
            {depthLabel}
          </div>
        </div>
      </div>

      {/* Bottom weather panel */}
      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-auto">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h4 className="text-sm font-bold text-foreground truncate min-w-0">
              {spot.label}
            </h4>
            <button
              type="button"
              onClick={onDeselect}
              aria-label="Seçimi kaldır"
              className="
                flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                bg-secondary text-muted-foreground hover:text-foreground
                hover:bg-secondary/80 transition-colors cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isLoading && <WeatherSkeleton />}

          {isError && (
            <p className="text-xs text-center text-muted-foreground">
              Hava durumu yüklenemedi.
            </p>
          )}

          {weather && !isLoading && (
            <div className="flex gap-2 justify-between">
              <WeatherMetric
                icon={Thermometer}
                iconClassName="text-orange-500"
                value={`${weather.temperature.toFixed(2)}°C`}
                label="Sıcaklık"
              />
              <WeatherMetric
                icon={Wind}
                iconClassName="text-teal-500"
                value={`${weather.windSpeed.toFixed(2)} m/s`}
                label="Rüzgar"
              />
              <WeatherMetric
                icon={Activity}
                iconClassName="text-purple-500"
                value={`${Math.round(weather.pressure)} hPa`}
                label="Basınç"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
