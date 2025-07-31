import type { ComponentType } from "react";
import { Card } from "@/components/ui/card";
import { Area, AreaChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { HistoryData } from "@/types";

type Metric = {
    label: string;
    value: string | number;
    unit?: string;
};

type SensorCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  metric: Metric;
  metric2?: Metric;
  data: HistoryData[];
  dataKey: keyof HistoryData;
  chartConfig: ChartConfig;
};

export function SensorCard({ icon: Icon, title, metric, metric2, data, dataKey, chartConfig }: SensorCardProps) {
  return (
    <Card className="bg-background/50 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-4 pb-2">
        <div className="flex flex-row items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/80">{metric.label}</p>
            <div className="flex items-baseline">
                <p className="text-2xl font-bold text-primary">{metric.value}</p>
                {metric.unit && <p className="text-xs text-muted-foreground ml-1">{metric.unit}</p>}
            </div>
          </div>
          {metric2 && (
            <div className="text-right">
              <p className="text-sm text-foreground/80">{metric2.label}</p>
              <div className="flex items-baseline justify-end">
                  <p className="text-xl font-semibold text-foreground/90">{metric2.value}</p>
                  {metric2.unit && <p className="text-xs text-muted-foreground ml-1">{metric2.unit}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-8 w-full">
           <ChartContainer config={chartConfig} className="w-full h-full">
              <AreaChart
                  accessibilityLayer
                  data={data}
                  margin={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                  }}
              >
                  <defs>
                      <linearGradient id={`fill-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={`var(--color-${String(dataKey)})`} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={`var(--color-${String(dataKey)})`} stopOpacity={0.1} />
                      </linearGradient>
                  </defs>
                  <Area
                      dataKey={dataKey}
                      type="natural"
                      fill={`url(#fill-${String(dataKey)})`}
                      stroke={`var(--color-${String(dataKey)})`}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                  />
              </AreaChart>
          </ChartContainer>
      </div>
    </Card>
  );
}
