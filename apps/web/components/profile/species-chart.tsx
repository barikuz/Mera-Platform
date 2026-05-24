"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SpeciesDataPoint {
  name: string;
  value: number;
}

interface SpeciesChartProps {
  data: SpeciesDataPoint[];
}

const CHART_COLORS = [
  "#00ccb2", // mera-accent
  "#3b82f6", // chart-1
  "#f59e0b", // chart-4
  "#ef4444", // chart-5
  "#10b981", // success
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value} kayıt</p>
    </div>
  );
}

export function SpeciesChart({ data }: SpeciesChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-sm font-semibold text-foreground mb-4">Tür Dağılımı</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: "12px",
              color: "var(--color-muted-foreground)",
              paddingTop: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
