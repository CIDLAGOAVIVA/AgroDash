"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { HistoryData } from "@/types"

export const chartConfig = {
  soilTemperature: {
    label: "Temp. Solo (°C)",
    color: "hsl(var(--chart-2))",
  },
  airTemperature: {
    label: "Temp. Ar (°C)",
    color: "hsl(var(--chart-1))",
  },
  soilMoisture: {
    label: "Umidade do Solo (%)",
    color: "hsl(var(--chart-4))",
  },
  airHumidity: {
    label: "Umidade do Ar (%)",
    color: "hsl(var(--chart-5))",
  },
  solarRadiation: {
    label: "Radiação Solar (W/m²)",
    color: "hsl(var(--chart-3))",
  },
  vegetationIndex: {
    label: "Índice Vegetativo (NDVI)",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig

type HistoryChartProps = {
  data: HistoryData[];
}

export function HistoryChart({ data }: HistoryChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <AreaChart 
        accessibilityLayer 
        data={data} 
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={5}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          cursor={true}
          content={<ChartTooltipContent 
            indicator="dot" 
            labelClassName="font-semibold" 
          />}
        />
        <defs>
          <linearGradient id="fillAirTemperature" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-airTemperature)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-airTemperature)" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="fillSoilTemperature" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-soilTemperature)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-soilTemperature)" stopOpacity={0.1}/>
          </linearGradient>
           <linearGradient id="fillSoilMoisture" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-soilMoisture)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-soilMoisture)" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Area
          dataKey="airTemperature"
          type="natural"
          fill="url(#fillAirTemperature)"
          stroke="var(--color-airTemperature)"
          strokeWidth={2.5}
          stackId="a"
          isAnimationActive={false}
        />
        <Area
          dataKey="soilTemperature"
          type="natural"
          fill="url(#fillSoilTemperature)"
          stroke="var(--color-soilTemperature)"
          strokeWidth={2.5}
          stackId="b"
          isAnimationActive={false}
        />
        <Area
          dataKey="soilMoisture"
          type="natural"
          fill="url(#fillSoilMoisture)"
          stroke="var(--color-soilMoisture)"
          strokeWidth={2.5}
          stackId="c"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
