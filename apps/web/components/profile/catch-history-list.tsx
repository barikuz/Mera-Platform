"use client";

import { useMemo, useState } from "react";
import { Fish } from "lucide-react";
import type { CatchRecord, FishSpeciesCatalogItem } from "@/lib/catches-api";
import { CatchHistoryItem } from "./catch-history-item";
import { MapViewModal } from "@/components/assistant/map-view-modal";

interface Props {
  catches: CatchRecord[];
  species: FishSpeciesCatalogItem[];
}

export function CatchHistoryList({ catches, species }: Props) {
  const [selectedMap, setSelectedMap] = useState<{lat: number; lng: number; label: string} | null>(null);

  const speciesMap = useMemo(
    () => new Map(species.map((s) => [s.id, s.name])),
    [species]
  );

  // Sort newest first
  const sorted = useMemo(
    () =>
      [...catches].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [catches]
  );

  if (!sorted.length) return null;

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
          <Fish className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Av Geçmişi</h2>
          <p className="text-xs text-muted-foreground">
            {sorted.length} kayıt — en yeniden en eskiye
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {sorted.map((record) => {
          const speciesName =
            speciesMap.get(record.species_id) ?? "Bilinmeyen Tür";

          return (
            <CatchHistoryItem
              key={record.id}
              record={record}
              speciesName={speciesName}
              onMapClick={() => {
                if (record.location_lat != null && record.location_lng != null) {
                  setSelectedMap({
                    lat: record.location_lat,
                    lng: record.location_lng,
                    label: `${speciesName} Konumu`,
                  });
                }
              }}
            />
          );
        })}
      </div>

      {selectedMap && (
        <MapViewModal
          isOpen={!!selectedMap}
          coords={{ lat: selectedMap.lat, lng: selectedMap.lng }}
          label={selectedMap.label}
          onClose={() => setSelectedMap(null)}
        />
      )}
    </div>
  );
}
