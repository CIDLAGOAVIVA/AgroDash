"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { HistoryData } from "@/types"

const chartConfig = {
  soilTemperature: {
    label: "Temp. Solo",
    color: "hsl(var(--chart-2))",
  },
  airTemperature: {
    label: "Temp. Ar",
    color: "hsl(var(--chart-4))",
  },
  soilMoisture: {
    label: "Umidade",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

type HistoryChartProps = {
  data: HistoryData[];
  cropType: string;
}

export function HistoryChart({ data, cropType }: HistoryChartProps) {
  const isCorn = cropType === 'Milho';
  const tickColor = isCorn ? 'hsl(210 40% 70%)' : 'hsl(var(--muted-foreground))';
  const gridColor = isCorn ? 'hsl(202 44% 35%)' : 'hsl(var(--border) / 0.5)';

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
          stroke={tickColor}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={4}
          domain={['dataMin - 5', 'dataMax + 5']}
          stroke={tickColor}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent 
            indicator="dot" 
            labelClassName="font-semibold" 
            className={isCorn ? 'bg-card text-card-foreground' : ''}
          />}
        />
        <Line
          dataKey="soilTemperature"
          name="Temp. Solo (°C)"
          type="monotone"
          stroke="var(--color-soilTemperature)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="airTemperature"
          name="Temp. Ar (°C)"
          type="monotone"
          stroke="var(--color-airTemperature)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="soilMoisture"
          name="Umidade (%)"
          type="monotone"
          stroke="var(--color-soilMoisture)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
