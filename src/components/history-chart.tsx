
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { HistoryData } from "@/types"

type HistoryChartProps = {
  data: HistoryData[];
  dataKey: keyof Omit<HistoryData, 'time' | 'windDirection'>;
  stroke: string;
}

export function HistoryChart({ data, dataKey, stroke }: HistoryChartProps) {
    
  const chartConfig = {
    [dataKey]: {
      label: dataKey.toString(),
      color: stroke,
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart 
        accessibilityLayer 
        data={data} 
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
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
          domain={['auto', 'auto']}
        />
        <Tooltip
          cursor={true}
          content={<ChartTooltipContent 
            indicator="dot" 
            labelClassName="font-semibold" 
            formatter={(value, name) => [`${value}`, '']}
          />}
        />
        <defs>
          <linearGradient id={`fill-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={stroke} stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <Area
          dataKey={dataKey}
          type="natural"
          fill={`url(#fill-${String(dataKey)})`}
          stroke={stroke}
          strokeWidth={2.5}
          stackId="a"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
