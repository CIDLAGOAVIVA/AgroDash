"use client"

import { AlertTriangle, Leaf, Sun, Thermometer, Droplets, GitCommitHorizontal, AreaChart, Wheat } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 shadow-lg border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/20">
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
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-1 md:col-span-1 p-6 space-y-4">
             <h3 className="text-lg font-semibold text-foreground/90">Métricas Atuais</h3>
             <DataMetric icon={Thermometer} label="Temperatura do Ar" value={crop.airTemperature.toFixed(1)} unit="°C" />
             <DataMetric icon={Thermometer} label="Temperatura do Solo" value={crop.soilTemperature.toFixed(1)} unit="°C" />
             <DataMetric icon={Droplets} label="Umidade do Solo" value={crop.soilMoisture.toFixed(1)} unit="%" />
             <DataMetric icon={Sun} label="Radiação Solar" value={Math.round(crop.solarRadiation)} unit="W/m²" />
             <DataMetric icon={AreaChart} label="Índice de Vegetação" value={crop.vegetationIndex.toFixed(2)} />
          </div>
          <div className="col-span-1 md:col-span-2 p-6 border-l border-border">
             <h3 className="text-lg font-semibold mb-4 text-foreground/90">Histórico de Sensores</h3>
            <HistoryChart data={crop.history} />
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-6 bg-muted/20 flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <DataMetric icon={GitCommitHorizontal} label="Estágio de Desenvolvimento" value={crop.plantDevelopmentStage} />
        </div>
        {crop.alertMessage && (
          <Alert variant="destructive" className="w-full animate-in fade-in-0 zoom-in-95 mt-4">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-bold">Alerta: Anomalia Detectada!</AlertTitle>
            <AlertDescription>{crop.alertMessage}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
