"use client";

import { cn } from "@/lib/utils";
import type { Period } from "@/types";
import { Button } from "./ui/button";

type PeriodSelectorProps = {
  period: Period;
  setPeriod: (period: Period) => void;
  className?: string;
};

const periods: { value: Period; label: string }[] = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
];

export function PeriodSelector({ period, setPeriod, className }: PeriodSelectorProps) {
  return (
    <div className={cn("flex items-center space-x-1 bg-muted p-1 rounded-lg", className)}>
      {periods.map((p) => (
        <Button
          key={p.value}
          size="sm"
          onClick={() => setPeriod(p.value)}
          variant={period === p.value ? "default" : "ghost"}
          className={cn(
            "px-3 py-1.5 h-auto text-sm transition-all duration-200",
            period === p.value 
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
