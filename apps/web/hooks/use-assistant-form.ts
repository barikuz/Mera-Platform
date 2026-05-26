import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ResultStatus } from "@/types/assistant";

export function useAssistantForm<TResult, TPayload>(
  formName: string,
  mutationFn: (payload: TPayload) => Promise<TResult[]>
) {
  const queryClient = useQueryClient();
  const queryKey = ["assistantResult", formName];

  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  
  // Keep track of the last payload for retrying
  const lastPayloadRef = useRef<TPayload | null>(null);

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      console.log(`[${formName}] Başarıyla sonuçlar alındı.`);
    },
    onError: (error) => {
      console.error(`[${formName}] Hata:`, error);
    },
  });

  // Read persisted results from query cache
  const { data: cachedResults } = useQuery({
    queryKey,
    queryFn: () => [] as TResult[], // dummy, never fetches
    enabled: false,
    staleTime: Infinity,
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
  } else if (cachedResults && (cachedResults as TResult[]).length > 0) {
    resultStatus = "success"; // Restored from cache!
  }

  const results = mutation.data ?? (cachedResults as TResult[]) ?? [];

  return {
    selectedSpecies,
    setSelectedSpecies,
    selectedLocation,
    setSelectedLocation,
    resultStatus,
    results,
    submitForm,
    handleRetry,
  };
}
