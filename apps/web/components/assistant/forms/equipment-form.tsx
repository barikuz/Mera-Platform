"use client";

import { useState, useCallback } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { FISH_SPECIES, FISHING_SPOTS, FISHING_STYLES } from "@/constants/assistant";
import { LatLng } from "@/types/assistant";

export function EquipmentForm() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    handleFormSubmit,
  } = useAssistantForm("Ekipman Tavsiyesi");

  const [selectedStyles, setSelectedStyles] = useState<string>("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<LatLng | null>(null);

  const handleMapSave = useCallback((coords: LatLng) => {
    setMapCoords(coords);
    setIsMapOpen(false);
    setSelectedLocation("");
  }, [setSelectedLocation]);

  const onSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e, { fishingStyles: selectedStyles, mapCoords });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-6">
          <PillSelector
            id="equipment-species"
            label="Hedef Balık Türü"
            options={FISH_SPECIES}
            selected={selectedSpecies}
            onChange={setSelectedSpecies}
          />
          <LocationCombobox
            id="equipment-location"
            options={FISHING_SPOTS}
            selected={selectedLocation}
            onChange={(val) => {
              setSelectedLocation(val);
              if (val) setMapCoords(null);
            }}
            onMapOpen={() => setIsMapOpen(true)}
            mapCoords={mapCoords}
          />
          <PillSelector
            id="equipment-style"
            label="Avlanma Stili"
            options={FISHING_STYLES}
            selected={selectedStyles}
            onChange={setSelectedStyles}
          />
        </div>
        <SubmitButton label="Kombinasyon Önerisi Al" />
      </form>

      <MapPickerModal
        isOpen={isMapOpen}
        initialCoords={mapCoords}
        onClose={() => setIsMapOpen(false)}
        onSave={handleMapSave}
      />
    </>
  );
}
