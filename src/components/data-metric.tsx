import type { ComponentType } from "react";
import { Card } from "@/components/ui/card";

type DataMetricProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  unit?: string;
};

export function DataMetric({ icon: Icon, label, value, unit }: DataMetricProps) {
  return (
    <div className="flex items-center space-x-3">
        <Icon className="h-7 w-7 text-primary/80" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}
