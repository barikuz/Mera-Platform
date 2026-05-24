import * as React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

export function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground leading-tight">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground truncate">{sub}</p>
        )}
      </div>
    </div>
  );
}
