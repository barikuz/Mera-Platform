"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { SubmitButton } from "../submit-button";
import { useAssistantForm } from "@/hooks/use-assistant-form";
import { PillSelector } from "../pill-selector";
import { LocationCombobox } from "../location-combobox";
import { MapPickerModal } from "../map-picker-modal";
import { EquipmentResultsSection } from "../results/equipment-results-section";
import { ELAZIG_CENTER } from "@/constants/assistant";
import { LatLng, FilterTag, EquipmentResult } from "@/types/assistant";
import { fetchGearRecommendation, GearRecommendationRequest, fetchFishingSpots, fetchFishSpecies, fetchFishingStyles } from "@/lib/assistant-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function GearRecommendationForm() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    results,
    submitForm,
    handleRetry,
  } = useAssistantForm<EquipmentResult, GearRecommendationRequest>(
    "Ekipman Tavsiyesi",
    fetchGearRecommendation
  );

  const [selectedStyles, setSelectedStyles] = useState<string>("");
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

  const { data: fishingStyles = [], isLoading: isLoadingStyles } = useQuery({
    queryKey: ["fishingStyles"],
    queryFn: fetchFishingStyles,
  });

  const queryClient = useQueryClient();
  const { data: submittedTags = [] } = useQuery<FilterTag[]>({
    queryKey: ["submittedTags", "gear"],
    queryFn: () => [],
    enabled: false,
    staleTime: Infinity,
  });
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
    
    if (selectedStyles) {
      tags.push({ emoji: "🎣", label: selectedStyles });
    }
    return tags;
  }, [selectedSpecies, selectedLocation, mapCoords, selectedStyles, fishingSpots]);

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
    
    const spot = fishingSpots.find((s) => s.id === selectedLocation);
    const coordinates = mapCoords ?? (spot?.lat && spot?.lng ? { lat: spot.lat, lng: spot.lng } : ELAZIG_CENTER); 
    
    submitForm({
      targetFish: selectedSpecies,
      coordinates,
      fishingStyle: selectedStyles
    });
    queryClient.setQueryData(["submittedTags", "gear"], filterTags);
  };


  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="space-y-6">
          <PillSelector
            id="equipment-species"
            label="Hedef Balık"
            options={fishSpecies}
            selected={selectedSpecies}
            onChange={(val) => {
              setSelectedSpecies(val);
              setErrors((prev) => ({ ...prev, species: "" }));
            }}
            error={errors.species}
            isLoading={isLoadingSpecies}
          />
          <LocationCombobox
            id="equipment-location"
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
          <PillSelector
            id="equipment-style"
            label="Avlanma Stili"
            options={fishingStyles}
            selected={selectedStyles}
            onChange={(val) => {
              setSelectedStyles(val);
              setErrors((prev) => ({ ...prev, style: "" }));
            }}
            error={errors.style}
            isLoading={isLoadingStyles}
          />
        </div>

        <SubmitButton label="Kombinasyon Önerisi Al" />
      </form>

      {/* Results section */}
      <EquipmentResultsSection
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
