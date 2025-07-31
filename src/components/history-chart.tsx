"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { HistoryData } from "@/types"

const chartConfig = {
  soilTemperature: {
    label: "Soil Temp",
    color: "hsl(var(--chart-2))",
  },
  airTemperature: {
    label: "Air Temp",
    color: "hsl(var(--chart-4))",
  },
  soilMoisture: {
    label: "Moisture",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

type HistoryChartProps = {
  data: HistoryData[]
}

export function HistoryChart({ data }: HistoryChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={4}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" labelClassName="font-semibold" />}
        />
        <Line
          dataKey="soilTemperature"
          name="Soil Temp (°C)"
          type="monotone"
          stroke="var(--color-soilTemperature)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="airTemperature"
          name="Air Temp (°C)"
          type="monotone"
          stroke="var(--color-airTemperature)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="soilMoisture"
          name="Moisture (%)"
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
