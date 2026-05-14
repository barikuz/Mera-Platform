import { useState, useRef, useEffect, useCallback } from "react";
import { LatLng } from "@/types/assistant";
import { MapMouseEvent } from "@vis.gl/react-google-maps";

export function useMapPicker(
  isOpen: boolean,
  onClose: () => void,
  onSave: (coords: LatLng) => void,
  initialCoords?: LatLng | null
) {
  const [markerPos, setMarkerPos] = useState<LatLng | null>(
    initialCoords ?? null
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [isLocating, setIsLocating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Reset marker when modal opens with new initialCoords
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setMarkerPos(initialCoords ?? null);
    }
  }

  // Escape key + focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Focus the close button when modal opens
    setTimeout(() => firstFocusRef.current?.focus(), 50);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setMarkerPos({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  }, []);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMarkerPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert("Konum alınamadı. Lütfen tarayıcı izinlerini kontrol edin.");
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSaveClick = useCallback(() => {
    if (markerPos) {
      onSave(markerPos);
    }
  }, [markerPos, onSave]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return {
    markerPos,
    isLocating,
    overlayRef,
    firstFocusRef,
    handleMapClick,
    handleLocateMe,
    handleSaveClick,
    handleBackdropClick,
  };
}
