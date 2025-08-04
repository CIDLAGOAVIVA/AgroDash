
"use client"

import { Leaf, Wheat } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Crop } from "@/types";
import { WeatherForecast } from "./weather-forecast";

const Sprout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10"/><path d="M12 20V4"/><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72"/><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72"/></svg>
)

const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

interface CropCardProps {
    crop: Crop;
}

export function CropCard({ crop }: CropCardProps) {
  const CropIcon = cropIcons[crop.cropType] || Leaf;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
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
        <WeatherForecast />
      </CardContent>
    </Card>
  );
}
