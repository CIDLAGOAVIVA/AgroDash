
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type DataMetricProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  unit?: string;
  value2?: string | number;
  unit2?: string;
  onClick?: () => void;
  isCompact?: boolean;
};

export function DataMetric({ icon: Icon, label, value, unit, value2, unit2, onClick, isCompact = false }: DataMetricProps) {
  
  if (isCompact) {
    return (
      <Card 
        className={cn(
            "flex flex-col justify-between",
            onClick && "cursor-pointer hover:bg-muted/50 transition-colors duration-200"
        )}
        onClick={onClick}
      >
        <CardHeader className="p-3 flex-row items-center gap-3 space-y-0">
          <Icon className="h-6 w-6 text-primary/80 flex-shrink-0" />
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
           <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-foreground">
                {value}
                {unit && <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>}
              </p>
              {value2 && (
                  <p className="text-lg font-bold text-foreground">
                  {value2}
                  {unit2 && <span className="text-xs font-normal text-muted-foreground ml-1">{unit2}</span>}
                  </p>
              )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div 
        className={cn(
            "flex items-center space-x-4 rounded-lg bg-background p-3 transition-colors duration-200",
            onClick && "cursor-pointer hover:bg-muted/50"
        )}
        onClick={onClick}
    >
        <Icon className="h-7 w-7 text-primary/80 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-4">
            <p className="text-xl font-bold text-foreground">
            {value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
            </p>
            {value2 && (
                <p className="text-xl font-bold text-foreground">
                {value2}
                {unit2 && <span className="text-sm font-normal text-muted-foreground ml-1">{unit2}</span>}
                </p>
            )}
        </div>
      </div>
    </div>
  );
}
