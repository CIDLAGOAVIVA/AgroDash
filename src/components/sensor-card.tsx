import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Metric = {
    label: string;
    value: string | number;
    unit?: string;
};

type SensorCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  metrics: Metric[];
};

export function SensorCard({ icon: Icon, title, metrics }: SensorCardProps) {
  return (
    <Card className="bg-background/50 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
      <CardContent className="pt-2">
        {metrics.map((metric, index) => (
            <div key={index}>
                 {index > 0 && <Separator className="my-3" />}
                <div className="flex justify-between items-baseline">
                    <p className="text-sm text-foreground/80">{metric.label}</p>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-primary">{metric.value}</p>
                        {metric.unit && <p className="text-sm text-muted-foreground ml-1">{metric.unit}</p>}
                    </div>
                </div>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
