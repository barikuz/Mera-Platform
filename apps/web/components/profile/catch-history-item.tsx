"use client";

import { Clock, Scale, Ruler } from "lucide-react";
import type { CatchRecord } from "@/lib/catches-api";
import { formatDateTime } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CatchMapThumbnail } from "./catch-map-thumbnail";

interface Props {
  record: CatchRecord;
  speciesName: string;
  onMapClick?: () => void;
}

export function CatchHistoryItem({ record, speciesName, onMapClick }: Props) {
  const hasLocation =
    record.location_lat != null && record.location_lng != null;

  return (
    <Card className="group flex flex-row gap-4 p-4 transition-shadow hover:shadow-md">
      {/* Left: info */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Species name */}
        <p className="truncate text-base font-semibold text-foreground">
          {speciesName}
        </p>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatDateTime(record.created_at)}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {record.weight_kg != null && (
            <Badge variant="secondary" className="gap-1 rounded-full text-muted-foreground">
              <Scale className="h-3 w-3" />
              {record.weight_kg} kg
            </Badge>
          )}
          {record.length_cm != null && (
            <Badge variant="secondary" className="gap-1 rounded-full text-muted-foreground">
              <Ruler className="h-3 w-3" />
              {record.length_cm} cm
            </Badge>
          )}
        </div>

        {/* Location label when no coords */}
        {!hasLocation && (
          <p className="text-xs text-muted-foreground/70">
            Konum bilgisi yok
          </p>
        )}
      </div>

      {/* Right: map thumbnail */}
      {hasLocation ? (
        <button
          type="button"
          onClick={onMapClick}
          className="flex-shrink-0 w-[120px] h-[80px] rounded-lg overflow-hidden border border-border bg-muted/30 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`${speciesName} haritada görüntüle`}
        >
          <CatchMapThumbnail
            lat={record.location_lat}
            lng={record.location_lng}
          />
        </button>
      ) : (
        <div className="flex-shrink-0 w-[120px] h-[80px] rounded-lg overflow-hidden border border-border bg-muted/30">
          <CatchMapThumbnail lat={null} lng={null} />
        </div>
      )}
    </Card>
  );
}
