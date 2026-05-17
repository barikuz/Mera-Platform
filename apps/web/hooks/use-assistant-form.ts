import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ResultStatus } from "@/types/assistant";

export function useAssistantForm<TResult, TPayload>(
  formName: string,
  mutationFn: (payload: TPayload) => Promise<TResult[]>
) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  
  // Keep track of the last payload for retrying
  const lastPayloadRef = useRef<TPayload | null>(null);

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      console.log(`[${formName}] Başarıyla sonuçlar alındı.`);
    },
    onError: (error) => {
      console.error(`[${formName}] Hata:`, error);
    },
  });

  const submitForm = useCallback(
    (payload: TPayload) => {
      lastPayloadRef.current = payload;
      mutation.mutate(payload);
    },
    [mutation]
  );

  const handleRetry = useCallback(() => {
    if (lastPayloadRef.current) {
      mutation.mutate(lastPayloadRef.current);
    }
  }, [mutation]);

  // Derive status
  let resultStatus: ResultStatus = "idle";
  if (mutation.isPending) {
    resultStatus = "loading";
  } else if (mutation.isError) {
    resultStatus = "error";
  } else if (mutation.isSuccess) {
    resultStatus = "success";
  }

  return {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    results: mutation.data ?? [],
    submitForm,
    handleRetry,
  };
}
