"use client";

import { useState, useCallback, useMemo } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { TipResultsSection } from "../results/tip-results-section";
import { FISH_SPECIES, FISHING_SPOTS, ELAZIG_CENTER } from "@/constants/assistant";
import { LatLng, FilterTag, TipResult } from "@/types/assistant";
import { fetchTechnicalTips, TechnicalTipsRequest } from "@/lib/assistant-api";

export function TechnicalTipsForm() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    results,
    submitForm,
    handleRetry,
  } = useAssistantForm<TipResult, TechnicalTipsRequest>(
    "Teknik İpuçları",
    fetchTechnicalTips
  );

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<LatLng | null>(null);
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
    return tags;
  }, [selectedSpecies, selectedLocation, mapCoords]);

  const [submittedTags, setSubmittedTags] = useState<FilterTag[]>([]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedSpecies) newErrors.species = "Lütfen bu alanı boş bırakmayın.";
    if (!selectedLocation && !mapCoords) newErrors.location = "Lütfen bu alanı boş bırakmayın.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const coordinates = mapCoords ?? ELAZIG_CENTER; 
    
    submitForm({
      targetFish: selectedSpecies,
      coordinates
    });
    setSubmittedTags(filterTags);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-6">
          <PillSelector
            id="tips-species"
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
            id="tips-location"
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
        </div>

        <SubmitButton label="Taktikleri Gör" />
      </form>

      {/* Results section */}
      <TipResultsSection
        status={resultStatus}
        results={results}
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
