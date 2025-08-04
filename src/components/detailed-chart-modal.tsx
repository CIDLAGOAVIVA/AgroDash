
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HistoryChart } from "./history-chart"
import { PeriodSelector } from "./period-selector"
import type { DetailedChartData } from "@/lib/data"

interface DetailedChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: DetailedChartData | null;
}

export function DetailedChartModal({ isOpen, onClose, chartData }: DetailedChartModalProps) {
  if (!chartData) return null;

  const { title, data, dataKey, period, setPeriod, stroke } = chartData;

  const historyData = data.slice(
    period === '7d' ? -7 : period === '24h' ? -1 : -30
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <PeriodSelector period={period} setPeriod={setPeriod} />
        </DialogHeader>
        <div className="h-96 w-full pt-4">
          <HistoryChart 
            data={historyData} 
            dataKey={dataKey} 
            stroke={stroke} 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
