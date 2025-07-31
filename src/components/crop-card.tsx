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
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

type CropCardProps = {
  crop: Crop;
};

export function CropCard({ crop }: CropCardProps) {
  const CropIcon = cropIcons[crop.cropType] || Leaf;

  const cardStyle = crop.cropType === 'Milho' ? { backgroundColor: 'hsl(202 44% 25%)', color: 'hsl(210 40% 98%)' } : {};
  const cardTitleStyle = crop.cropType === 'Milho' ? { color: 'hsl(210 40% 98%)' } : {};
  const cardDescriptionStyle = crop.cropType === 'Milho' ? { color: 'hsl(210 40% 80%)' } : {};

  return (
    <Card style={cardStyle} className="w-full overflow-hidden transition-all duration-300 shadow-md border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <CropIcon className="h-8 w-8 text-primary"/>
          </div>
          <div>
            <CardTitle style={cardTitleStyle} className="text-2xl font-bold">{crop.cropType}</CardTitle>
            <CardDescription style={cardDescriptionStyle} className="text-base">{crop.fieldName}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {crop.alertMessage && (
          <Alert variant="destructive" className="mb-6 animate-in fade-in-0 zoom-in-95">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Anomalia Detectada!</AlertTitle>
            <AlertDescription>{crop.alertMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <DataMetric cropType={crop.cropType} icon={Thermometer} label="Temperatura do Ar" value={crop.airTemperature.toFixed(1)} unit="°C" />
          <DataMetric cropType={crop.cropType} icon={Thermometer} label="Temperatura do Solo" value={crop.soilTemperature.toFixed(1)} unit="°C" />
          <DataMetric cropType={crop.cropType} icon={Droplets} label="Umidade do Solo" value={crop.soilMoisture.toFixed(1)} unit="%" />
          <DataMetric cropType={crop.cropType} icon={Sun} label="Radiação Solar" value={Math.round(crop.solarRadiation)} unit="W/m²" />
          <DataMetric cropType={crop.cropType} icon={GitCommitHorizontal} label="Estágio de Desenv." value={crop.plantDevelopmentStage} />
          <DataMetric cropType={crop.cropType} icon={AreaChart} label="Índice de Vegetação" value={crop.vegetationIndex.toFixed(2)} />
        </div>
        <div>
          <h3 style={cardTitleStyle} className="text-lg font-semibold mb-2 text-foreground/90">Histórico Recente</h3>
          <HistoryChart data={crop.history} cropType={crop.cropType}/>
        </div>
      </CardContent>
    </Card>
  );
}
