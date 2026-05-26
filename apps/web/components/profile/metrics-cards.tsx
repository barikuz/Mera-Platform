import { Fish, Trophy, Scale, Ruler } from "lucide-react";
import { StatCard } from "./stat-card";

interface MetricsCardsProps {
  totalCatches: number;
  speciesCount: number;
  heaviestCatch: {
    weight: number;
    speciesName: string;
  } | null;
  longestCatch: {
    length: number;
    speciesName: string;
  } | null;
}

export function MetricsCards({
  totalCatches,
  speciesCount,
  heaviestCatch,
  longestCatch,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
      <StatCard
        icon={<Fish className="h-5 w-5" />}
        label="Toplam Av"
        value={`${totalCatches}`}
        sub={totalCatches === 1 ? "kayıt" : "kayıt"}
      />
      <StatCard
        icon={<Trophy className="h-5 w-5" />}
        label="Farklı Tür"
        value={`${speciesCount}`}
        sub="tür avlandı"
      />
      {heaviestCatch && (
        <StatCard
          icon={<Scale className="h-5 w-5" />}
          label="En Ağır Av"
          value={`${heaviestCatch.weight} kg`}
          sub={heaviestCatch.speciesName}
        />
      )}
      {longestCatch && (
        <StatCard
          icon={<Ruler className="h-5 w-5" />}
          label="En Uzun Av"
          value={`${longestCatch.length} cm`}
          sub={longestCatch.speciesName}
        />
      )}
    </div>
  );
}
