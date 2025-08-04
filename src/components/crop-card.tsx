
"use client"

import { Leaf, Wheat, Thermometer, Droplets, Wind, Cloud, Waves } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Crop } from "@/types";
import { DataMetric } from "./data-metric";
import type { ComponentType } from "react";

const Sprout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10"/><path d="M12 20V4"/><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72"/><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72"/></svg>
)

const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

type Metric = {
  title: string;
  icon: ComponentType<{ className?: string; }>;
  value: string;
  unit: string;
  value2?: string;
  unit2?: string;
  onClick: () => void;
}

type CropCardProps = {
  crop: Crop;
  metrics: Metric[];
};

export function CropCard({ crop, metrics }: CropCardProps) {
  const CropIcon = cropIcons[crop.cropType] || Leaf;

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 shadow-lg border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between p-6">
        <div className="flex flex-row items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <CropIcon className="h-8 w-8 text-primary"/>
            </div>
            <div>
                <CardTitle className="text-2xl font-bold">{crop.cropType}</CardTitle>
                <CardDescription className="text-base">{crop.fieldName}</CardDescription>
            </div>
        </div>
      </CardHeader>
       <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             {metrics.map((metric) => (
                <DataMetric
                    key={metric.title}
                    icon={metric.icon}
                    label={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    value2={metric.value2}
                    unit2={metric.unit2}
                    onClick={metric.onClick}
                    isCompact={true}
                />
            ))}
          </div>
       </CardContent>
    </Card>
  );
}
