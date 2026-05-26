"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/landing/header";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FullScreenSpinner, Spinner } from "@/components/ui/spinner";
import { PillSelector } from "@/components/assistant/pill-selector";
import { MapPickerModal } from "@/components/assistant/map-picker-modal";
import { createCatch, fetchFishSpeciesCatalog } from "@/lib/catches-api";
import { useQuery } from "@tanstack/react-query";
import { LatLng } from "@/types/assistant";
import {
  Fish,
  Minus,
  Plus,
  MapPin,
  ArrowLeft,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Removed DIGER_OPTION as backend now uses UUIDs

/* ─── Increment / Decrement Input ─────────────────────────────────────────── */

function StepperInput({
  id,
  label,
  value,
  step,
  min,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  step: number;
  min: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const decrement = () => {
    const next = Math.round((value - step) * 100) / 100;
    onChange(Math.max(min, next));
  };
  const increment = () => {
    const next = Math.round((value + step) * 100) / 100;
    onChange(next);
  };

  const displayValue = step < 1 ? value.toFixed(1) : String(value);

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-foreground mb-3"
      >
        {label}
      </label>
      <div className="flex items-center gap-0 rounded-xl border border-border overflow-hidden bg-secondary/30 dark:bg-mera-neutral-800/30">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="flex items-center justify-center h-12 w-16 text-foreground hover:bg-secondary dark:hover:bg-mera-neutral-700/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label={`${label} azalt`}
        >
          <Minus className="h-5 w-5" />
        </button>
        <div
          id={id}
          className="flex-1 text-center text-lg font-semibold text-foreground tabular-nums"
          aria-live="polite"
        >
          {displayValue} {unit}
        </div>
        <button
          type="button"
          onClick={increment}
          className="flex items-center justify-center h-12 w-16 text-foreground hover:bg-secondary dark:hover:bg-mera-neutral-700/50 transition-colors cursor-pointer"
          aria-label={`${label} artır`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Add Catch Page ──────────────────────────────────────────────────────── */

export default function AddCatchPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [species, setSpecies] = useState("");
  const [lengthCm, setLengthCm] = useState(0);
  const [weightKg, setWeightKg] = useState(0);
  const [location, setLocation] = useState<LatLng | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch species from backend
  const { data: fishSpeciesCatalog = [], isLoading: isLoadingSpecies } = useQuery({
    queryKey: ["fishSpeciesCatalog"],
    queryFn: fetchFishSpeciesCatalog,
  });

  // Species options: backend list
  const speciesOptions = fishSpeciesCatalog.map((s) => s.name);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, user, router]);

  const handleMapSave = useCallback((coords: LatLng) => {
    setLocation(coords);
    setIsMapOpen(false);
  }, []);

  const isValid = species.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const selectedSpeciesItem = fishSpeciesCatalog.find((s) => s.name === species);
    if (!selectedSpeciesItem) {
      setSubmitError("Lütfen geçerli bir balık türü seçin.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createCatch({
        species_id: selectedSpeciesItem.id,
        ...(lengthCm > 0 ? { length_cm: lengthCm } : {}),
        ...(weightKg > 0 ? { weight_kg: weightKg } : {}),
        ...(location
          ? { location_lat: location.lat, location_lng: location.lng }
          : {}),
      });
      setSubmitSuccess(true);
      setTimeout(() => router.push("/profile"), 1200);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading || !user) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Back link */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Profile
        </Link>

        {/* Page heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-5">
            <Fish className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Av Ekle
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Tür seçimi zorunlu, diğer alanlar isteğe bağlıdır.
          </p>
        </div>

        {/* Success state */}
        {submitSuccess ? (
          <div className="bg-card text-card-foreground rounded-xl border border-mera-status-success/30 shadow-sm p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-mera-status-success/10 mb-4">
              <Check className="h-7 w-7 text-mera-status-success" />
            </div>
            <p className="text-lg font-semibold text-foreground">
              Av kaydı başarıyla oluşturuldu!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Profile yönlendiriliyorsunuz…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Species selection */}
            <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-5">
              <PillSelector
                id="catch-species"
                label="Tür"
                options={speciesOptions}
                selected={species}
                onChange={(val) => {
                  setSpecies(val);
                  setSubmitError("");
                }}
                isLoading={isLoadingSpecies}
              />
            </div>

            {/* Length */}
            <StepperInput
              id="catch-length"
              label="Boy (cm)"
              value={lengthCm}
              step={1}
              min={0}
              unit="cm"
              onChange={setLengthCm}
            />

            {/* Weight */}
            <StepperInput
              id="catch-weight"
              label="Ağırlık (kg)"
              value={weightKg}
              step={0.1}
              min={0}
              unit="kg"
              onChange={setWeightKg}
            />

            {/* Location */}
            <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-5">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Konum
              </label>
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-border bg-secondary/30 dark:bg-mera-neutral-800/30 text-sm font-medium text-foreground hover:bg-secondary dark:hover:bg-mera-neutral-700/50 transition-colors cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-primary" />
                Haritadan Konum Seç
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                {location
                  ? `Konum: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : "Konum seçilmedi."}
              </p>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-mera-status-error/10 border border-mera-status-error/20 text-sm text-mera-status-error animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" className="border-primary-foreground border-t-transparent" />
                  Kaydediliyor…
                </span>
              ) : (
                "Kaydet"
              )}
            </Button>
          </form>
        )}
      </main>

      {/* Map picker modal */}
      <MapPickerModal
        isOpen={isMapOpen}
        initialCoords={location}
        onClose={() => setIsMapOpen(false)}
        onSave={handleMapSave}
      />
    </div>
  );
}
