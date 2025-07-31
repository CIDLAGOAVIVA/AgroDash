import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes, ComponentType } from "react";
import { Card } from "@/components/ui/card";

type DataMetricProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  unit?: string;
  cropType: string;
};

export function DataMetric({ icon: Icon, label, value, unit, cropType }: DataMetricProps) {
  const cardStyle = cropType === 'Milho' ? { backgroundColor: 'hsl(202 44% 30%)' } : {backgroundColor: 'hsl(var(--background))'};
  const textStyle = cropType === 'Milho' ? { color: 'hsl(210 40% 98%)' } : {};
  const mutedTextStyle = cropType === 'Milho' ? { color: 'hsl(210 40% 70%)' } : {};
  
  return (
    <Card style={cardStyle} className="p-4 bg-background/50 hover:bg-muted/40 transition-colors border-0 shadow-none">
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p style={mutedTextStyle} className="text-sm text-muted-foreground">{label}</p>
          <p style={textStyle} className="text-2xl font-semibold">
            {value}
            {unit && <span style={mutedTextStyle} className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}
