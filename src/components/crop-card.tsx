"use client"

import { AlertTriangle, Leaf, Sun, Thermometer, Droplets, GitCommitHorizontal, AreaChart, Wheat } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataMetric } from "./data-metric";
import { HistoryChart } from "./history-chart";
import type { Crop } from "@/types";

const Sprout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10"/><path d="M12 20V4"/><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72"/><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72"/></svg>
)

const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soybeans": Leaf,
  "Corn": Sprout,
  "Wheat": Wheat,
};

type CropCardProps = {
  crop: Crop;
};

export function CropCard({ crop }: CropCardProps) {
  const CropIcon = cropIcons[crop.cropType] || Leaf;

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/50 animate-in fade-in-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-card">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/20 p-3 rounded-full">
            <CropIcon className="h-8 w-8 text-primary"/>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{crop.cropType}</CardTitle>
            <CardDescription className="text-base">{crop.fieldName}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {crop.alertMessage && (
          <Alert variant="destructive" className="mb-6 animate-in fade-in-0 zoom-in-95">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Anomaly Detected!</AlertTitle>
            <AlertDescription>{crop.alertMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <DataMetric icon={Thermometer} label="Air Temperature" value={crop.airTemperature.toFixed(1)} unit="°C" />
          <DataMetric icon={Thermometer} label="Soil Temperature" value={crop.soilTemperature.toFixed(1)} unit="°C" />
          <DataMetric icon={Droplets} label="Soil Moisture" value={crop.soilMoisture.toFixed(1)} unit="%" />
          <DataMetric icon={Sun} label="Solar Radiation" value={Math.round(crop.solarRadiation)} unit="W/m²" />
          <DataMetric icon={GitCommitHorizontal} label="Dev. Stage" value={crop.plantDevelopmentStage} />
          <DataMetric icon={AreaChart} label="Vegetation Index" value={crop.vegetationIndex.toFixed(2)} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground/90">Recent History</h3>
          <HistoryChart data={crop.history} />
        </div>
      </CardContent>
    </Card>
  );
}
