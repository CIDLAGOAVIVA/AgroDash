
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HistoryChart } from "./history-chart";
import type { HistoryData } from "@/types";

interface DetailedChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  dataKey?: keyof Omit<HistoryData, 'time' | 'windDirection'>;
  data: HistoryData[];
  stroke: string;
}

export function DetailedChartModal({ isOpen, onClose, title, dataKey, data, stroke }: DetailedChartModalProps) {
  if (!dataKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[60vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow w-full h-full p-4">
          <HistoryChart data={data} dataKey={dataKey} stroke={stroke} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
