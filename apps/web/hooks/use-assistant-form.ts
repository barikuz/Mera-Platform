import { useState, useCallback, useRef } from "react";
import { FISHING_SPOTS } from "@/constants/assistant";
import { ResultStatus } from "@/types/assistant";

const LOADING_DURATION_MS = 1500;

export function useAssistantForm(formName: string) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [resultStatus, setResultStatus] = useState<ResultStatus>("idle");
  const [simulateError, setSimulateError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCommonData = () => ({
    targetSpecies: selectedSpecies,
    location: FISHING_SPOTS.find((s) => s.id === selectedLocation) ?? null,
  });

  // Simulate the loading → success/error lifecycle
  const startResultCycle = useCallback(() => {
    // Clear any pending timer from a previous cycle
    if (timerRef.current) clearTimeout(timerRef.current);

    setResultStatus("loading");
    timerRef.current = setTimeout(() => {
      setResultStatus(simulateError ? "error" : "success");
    }, LOADING_DURATION_MS);
  }, [simulateError]);

  const handleFormSubmit = (
    e: React.FormEvent,
    additionalData: Record<string, unknown> = {}
  ) => {
    e.preventDefault();
    console.log(`[${formName}] Form değerleri:`, {
      ...getCommonData(),
      ...additionalData,
    });
    startResultCycle();
  };

  const handleRetry = useCallback(() => {
    startResultCycle();
  }, [startResultCycle]);

  const toggleSimulateError = useCallback(() => {
    setSimulateError((prev) => !prev);
  }, []);

  return {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    simulateError,
    toggleSimulateError,
    handleFormSubmit,
    handleRetry,
  };
}
