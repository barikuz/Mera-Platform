import { useState } from "react";
import { FISHING_SPOTS } from "@/constants/assistant";

export function useAssistantForm(formName: string) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const getCommonData = () => ({
    targetSpecies: selectedSpecies,
    location: FISHING_SPOTS.find((s) => s.id === selectedLocation) ?? null,
  });

  const handleFormSubmit = (
    e: React.FormEvent,
    additionalData: Record<string, unknown> = {}
  ) => {
    e.preventDefault();
    console.log(`[${formName}] Form değerleri:`, {
      ...getCommonData(),
      ...additionalData,
    });
  };

  return {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    handleFormSubmit,
  };
}
