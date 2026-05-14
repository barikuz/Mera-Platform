"use client";

import { useState, useCallback } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { FISH_SPECIES, FISHING_SPOTS } from "@/constants/assistant";
import { LatLng } from "@/types/assistant";

export function TipsForm() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    handleFormSubmit,
  } = useAssistantForm("Teknik İpuçları");

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<LatLng | null>(null);

  const handleMapSave = useCallback((coords: LatLng) => {
    setMapCoords(coords);
    setIsMapOpen(false);
    setSelectedLocation("");
  }, [setSelectedLocation]);

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e, { mapCoords })} className="space-y-8" noValidate>
        <div className="space-y-6">
          <PillSelector
            id="tips-species"
            label="Hedef Balık Türü"
            options={FISH_SPECIES}
            selected={selectedSpecies}
            onChange={setSelectedSpecies}
          />
          <LocationCombobox
            id="tips-location"
            options={FISHING_SPOTS}
            selected={selectedLocation}
            onChange={(val) => {
              setSelectedLocation(val);
              if (val) setMapCoords(null);
            }}
            onMapOpen={() => setIsMapOpen(true)}
            mapCoords={mapCoords}
          />
        </div>
        <SubmitButton label="Taktikleri Gör" />
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
