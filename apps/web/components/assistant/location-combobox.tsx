"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, X, Search } from "lucide-react";
import { FishingSpot, LatLng } from "@/types/assistant";

interface LocationComboboxProps {
  id: string;
  options: FishingSpot[];
  selected: string;
  onChange: (val: string) => void;
  /** Called when the map button is clicked — opens the picker modal */
  onMapOpen?: () => void;
  /** Coordinates returned from the map picker modal */
  mapCoords?: LatLng | null;
}

export function LocationCombobox({
  id,
  options,
  selected,
  onChange,
  onMapOpen,
  mapCoords,
}: LocationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(
    (s) =>
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.region.toLowerCase().includes(query.toLowerCase())
  );

  const selectedSpot = options.find((s) => s.id === selected);

  const handleSelect = (spotId: string) => {
    onChange(spotId);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <div className="space-y-3">
      <label
        htmlFor={`${id}-trigger`}
        className="block text-sm font-semibold text-foreground"
      >
        Balıkçılık Noktası / Bölge
      </label>
      <div className="flex items-stretch gap-2">
        {/* Combobox */}
        <div ref={containerRef} className="relative flex-1">
          {/* Trigger button */}
          <button
            id={`${id}-trigger`}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-listbox`}
            className={`
              w-full flex items-center justify-between gap-2 h-10 px-3.5 rounded-lg
              border border-border bg-card dark:bg-mera-neutral-800/60
              text-sm transition-all duration-150 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
              hover:border-primary/40 dark:hover:border-primary/40
              ${open ? "border-primary ring-2 ring-ring/30" : ""}
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {mapCoords ? (
                <span className="text-foreground truncate">
                  {mapCoords.lat.toFixed(5)}, {mapCoords.lng.toFixed(5)}
                </span>
              ) : selectedSpot ? (
                <span className="text-foreground truncate">{selectedSpot.label}</span>
              ) : (
                <span className="text-muted-foreground">Bir nokta seçin...</span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {selectedSpot && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Seçimi temizle"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <div
              id={`${id}-listbox`}
              role="listbox"
              aria-label="Balıkçılık noktaları"
              className="
                absolute z-50 top-[calc(100%+6px)] left-0 right-0
                bg-popover dark:bg-mera-neutral-800 border border-border
                rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30
                overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150
              "
            >
              {/* Search input */}
              <div className="p-2 border-b border-border">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/60 dark:bg-mera-neutral-900/60">
                  <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ara..."
                    className="
                      flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground
                      outline-none border-none
                    "
                    aria-label="Balıkçılık noktası ara"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="py-1 max-h-52 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                    Sonuç bulunamadı
                  </p>
                ) : (
                  filtered.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      role="option"
                      aria-selected={selected === spot.id}
                      onClick={() => handleSelect(spot.id)}
                      className={`
                        w-full flex items-center justify-between gap-3 px-3.5 py-2.5
                        text-sm text-left cursor-pointer transition-colors duration-100
                        hover:bg-secondary/70 dark:hover:bg-mera-neutral-700/50
                        ${selected === spot.id ? "bg-primary/10 dark:bg-primary/15 text-primary" : "text-foreground"}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                        <span>{spot.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-secondary dark:bg-mera-neutral-700 px-2 py-0.5 rounded-full">
                        {spot.region}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map picker button */}
        <button
          type="button"
          id={`${id}-map-btn`}
          onClick={onMapOpen}
          aria-label="Haritadan konum seç"
          title="Haritadan seç"
          disabled={!onMapOpen}
          className="
            flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg
            border border-border bg-card dark:bg-mera-neutral-800/60
            text-muted-foreground transition-all duration-150 cursor-pointer
            hover:border-primary/50 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <MapPin className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
