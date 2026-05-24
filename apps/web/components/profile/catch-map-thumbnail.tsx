"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

interface Props {
  lat: number | null;
  lng: number | null;
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

function staticMapUrl(lat: number, lng: number): string {
  return (
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${lat},${lng}` +
    `&zoom=14` +
    `&size=200x120` +
    `&scale=2` +
    `&markers=color:red%7C${lat},${lng}` +
    `&key=${MAPS_API_KEY}`
  );
}

export function CatchMapThumbnail({ lat, lng }: Props) {
  if (lat == null || lng == null) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground/60">
        <MapPin className="h-5 w-5" />
        <span className="text-[11px] font-medium">Konum Yok</span>
      </div>
    );
  }

  return (
    <Image
      src={staticMapUrl(lat, lng)}
      alt="Konum haritası"
      className="h-full w-full object-cover"
      width={200}
      height={120}
      unoptimized
    />
  );
}
