"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { MapViewModal } from "../map-view-modal";
import { SpotResultsSection } from "../results/spot-results-section";
import { ELAZIG_CENTER } from "@/constants/assistant";
import { LatLng, SpotResult, FilterTag } from "@/types/assistant";
import { fetchSpotRecommendation, SpotRecommendationRequest, fetchFishingSpots, fetchFishSpecies } from "@/lib/assistant-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function SpotRecommendationForm() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    results,
    submitForm,
    handleRetry,
  } = useAssistantForm<SpotResult, SpotRecommendationRequest>(
    "Mera Önerisi",
    fetchSpotRecommendation
  );

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<LatLng | null>(null);

  const { data: fishingSpots = [], isLoading: isLoadingSpots } = useQuery({
    queryKey: ["fishingSpots"],
    queryFn: fetchFishingSpots,
  });

  const { data: fishSpecies = [], isLoading: isLoadingSpecies } = useQuery({
    queryKey: ["fishSpecies"],
    queryFn: fetchFishSpecies,
  });

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

    const spot = fishingSpots.find((s) => s.id === selectedLocation);

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
  }, [selectedSpecies, selectedLocation, mapCoords, fishingSpots]);

  const queryClient = useQueryClient();
  const { data: submittedTags = [] } = useQuery<FilterTag[]>({
    queryKey: ["submittedTags", "spot"],
    queryFn: () => [],
    enabled: false,
    staleTime: Infinity,
  });

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
    
    const spot = fishingSpots.find((s) => s.id === selectedLocation);
    // Use map coords if available, otherwise fallback to the selected spot's coordinates or generic center
    const coordinates = mapCoords ?? (spot?.lat && spot?.lng ? { lat: spot.lat, lng: spot.lng } : ELAZIG_CENTER); 
    
    submitForm({
      targetFish: selectedSpecies,
      coordinates,
    });
    queryClient.setQueryData(["submittedTags", "spot"], filterTags);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-6">
          <PillSelector
            id="recommendation-species"
            label="Hedef Balık"
            options={fishSpecies}
            selected={selectedSpecies}
            onChange={(val) => {
              setSelectedSpecies(val);
              if (val) setErrors((prev) => ({ ...prev, species: "" }));
            }}
            error={errors.species}
            isLoading={isLoadingSpecies}
          />
          <LocationCombobox
            id="recommendation-location"
            options={fishingSpots}
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
            isLoading={isLoadingSpots}
          />
        </div>

        <div className="flex items-center gap-2">
          <SubmitButton label="Akıllı Öneri Al" />
        </div>
      </form>

      {/* Results section — appears after submit */}
      <SpotResultsSection
        status={resultStatus}
        results={results}
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
