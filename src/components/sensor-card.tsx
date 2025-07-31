import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  data: HistoryData[];
  dataKey: keyof HistoryData;
  chartConfig: ChartConfig;
};

export function SensorCard({ icon: Icon, title, metric, data, dataKey, chartConfig }: SensorCardProps) {
  return (
    <Card className="bg-background/50 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-2">
        <div>
          <p className="text-sm text-foreground/80">{metric.label}</p>
          <div className="flex items-baseline">
              <p className="text-3xl font-bold text-primary">{metric.value}</p>
              {metric.unit && <p className="text-sm text-muted-foreground ml-1">{metric.unit}</p>}
          </div>
        </div>
        <div className="h-28 -mx-6 -mb-6 mt-4">
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
                        <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area
                        dataKey={dataKey}
                        type="natural"
                        fill={`url(#fill-${dataKey})`}
                        stroke={`var(--color-${dataKey})`}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
