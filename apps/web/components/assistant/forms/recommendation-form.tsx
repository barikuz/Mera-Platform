"use client";

import { useState, useCallback, useMemo } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { MapViewModal } from "../map-view-modal";
import { SpotResultsSection } from "../results/spot-results-section";
import { FISH_SPECIES, FISHING_SPOTS } from "@/constants/assistant";
import { MOCK_SPOT_RESULTS } from "@/constants/assistant-results";
import { LatLng, SpotResult, FilterTag } from "@/types/assistant";

export function RecommendationForm() {
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
  } = useAssistantForm("Mera Önerisi");

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<LatLng | null>(null);

  // Read-only map view state
  const [mapViewResult, setMapViewResult] = useState<SpotResult | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMapSave = useCallback((coords: LatLng) => {
    setMapCoords(coords);
    setIsMapOpen(false);
    // Clear the combobox selection in favour of the map pick
    setSelectedLocation("");
    setErrors((prev) => ({ ...prev, location: "" }));
  }, [setSelectedLocation]);

  const handleShowMap = useCallback((result: SpotResult) => {
    setMapViewResult(result);
  }, []);

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
    
    handleFormSubmit(e, { mapCoords });
    setSubmittedTags(filterTags);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-6">
          <PillSelector
            id="recommendation-species"
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
            id="recommendation-location"
            options={FISHING_SPOTS}
            selected={selectedLocation}
            onChange={(val) => {
              setSelectedLocation(val);
              // Clear map coords when user picks from dropdown
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

        {/* Error simulation toggle (dev helper) */}
        <div className="flex items-center gap-2">
          <SubmitButton label="Akıllı Öneri Al" />
        </div>
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

      {/* Results section — appears after submit */}
      <SpotResultsSection
        status={resultStatus}
        results={MOCK_SPOT_RESULTS}
        filterTags={submittedTags}
        onRetry={handleRetry}
        onShowMap={handleShowMap}
      />

      {/* Map picker modal (for form location selection) */}
      <MapPickerModal
        isOpen={isMapOpen}
        initialCoords={mapCoords}
        onClose={() => setIsMapOpen(false)}
        onSave={handleMapSave}
      />

      {/* Map view modal (read-only, for "Haritada Gör") */}
      {mapViewResult && (
        <MapViewModal
          isOpen={!!mapViewResult}
          coords={mapViewResult.coordinates}
          label={mapViewResult.spotName}
          onClose={() => setMapViewResult(null)}
        />
      )}
    </>
  );
}
