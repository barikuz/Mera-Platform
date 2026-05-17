"use client";

import { useState, useCallback, useMemo } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { EquipmentResultsSection } from "../results/equipment-results-section";
import { FISH_SPECIES, FISHING_SPOTS, FISHING_STYLES } from "@/constants/assistant";
import { MOCK_EQUIPMENT_RESULTS } from "@/constants/assistant-results";
import { LatLng, FilterTag } from "@/types/assistant";

export function EquipmentForm() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    simulateError,
    toggleSimulateError,
    handleFormSubmit,
    handleRetry,
  } = useAssistantForm("Ekipman Tavsiyesi");

  const [selectedStyles, setSelectedStyles] = useState<string>("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<LatLng | null>(null);

  const [submittedTags, setSubmittedTags] = useState<FilterTag[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMapSave = useCallback((coords: LatLng) => {
    setMapCoords(coords);
    setIsMapOpen(false);
    setSelectedLocation("");
    setErrors((prev) => ({ ...prev, location: "" }));
  }, [setSelectedLocation]);

  // Build filter tags from current form selections
  const filterTags = useMemo<FilterTag[]>(() => {
    const tags: FilterTag[] = [];
    if (selectedSpecies) {
      tags.push({ emoji: "🐟", label: selectedSpecies });
    }

    const spot = FISHING_SPOTS.find((s) => s.id === selectedLocation);

    if (spot) {
      tags.push({ emoji: "📍", label: spot.label });
    } 
    else if (mapCoords) {
      tags.push({
        emoji: "📍",
        label: `Koordinat (${mapCoords.lat.toFixed(4)}, ${mapCoords.lng.toFixed(4)})`,
      });
    }
    
    if (selectedStyles) {
      tags.push({ emoji: "🎣", label: selectedStyles });
    }
    return tags;
  }, [selectedSpecies, selectedLocation, mapCoords, selectedStyles]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedSpecies) newErrors.species = "Lütfen bu alanı boş bırakmayın.";
    if (!selectedLocation && !mapCoords) newErrors.location = "Lütfen bu alanı boş bırakmayın.";
    if (!selectedStyles) newErrors.style = "Lütfen bu alanı boş bırakmayın.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    handleFormSubmit(e, { fishingStyles: selectedStyles, mapCoords });
    setSubmittedTags(filterTags);
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
            onChange={(val) => {
              setSelectedSpecies(val);
              if (val) setErrors((prev) => ({ ...prev, species: "" }));
            }}
            error={errors.species}
          />
          <LocationCombobox
            id="equipment-location"
            options={FISHING_SPOTS}
            selected={selectedLocation}
            onChange={(val) => {
              setSelectedLocation(val);
              if (val) {
                setMapCoords(null);
                setErrors((prev) => ({ ...prev, location: "" }));
              }
            }}
            onMapOpen={() => setIsMapOpen(true)}
            mapCoords={mapCoords}
            error={errors.location}
          />
          <PillSelector
            id="equipment-style"
            label="Avlanma Stili"
            options={FISHING_STYLES}
            selected={selectedStyles}
            onChange={(val) => {
              setSelectedStyles(val);
              if (val) setErrors((prev) => ({ ...prev, style: "" }));
            }}
            error={errors.style}
          />
        </div>

        <SubmitButton label="Kombinasyon Önerisi Al" />
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={toggleSimulateError}
            className="rounded border-border"
          />
          Hata simülasyonu
        </label>
      </form>

      {/* Results section */}
      <EquipmentResultsSection
        status={resultStatus}
        results={MOCK_EQUIPMENT_RESULTS}
        filterTags={submittedTags}
        onRetry={handleRetry}
      />

      <MapPickerModal
        isOpen={isMapOpen}
        initialCoords={mapCoords}
        onClose={() => setIsMapOpen(false)}
        onSave={handleMapSave}
      />
    </>
  );
}
