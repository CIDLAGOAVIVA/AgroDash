import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes, ComponentType } from "react";
import { Card } from "@/components/ui/card";

type DataMetricProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  unit?: string;
};

export function DataMetric({ icon: Icon, label, value, unit }: DataMetricProps) {
  return (
    <Card className="p-4 bg-background/50 hover:bg-muted/40 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="bg-muted p-3 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">
            {value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}
