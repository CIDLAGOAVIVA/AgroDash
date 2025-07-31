"use client"

import { Leaf, Sun, Thermometer, Droplets, GitCommitHorizontal, AreaChart, Wheat, Bot } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HistoryChart } from "./history-chart";
import { SensorCard } from "./sensor-card";
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
    <Card className="w-full overflow-hidden transition-all duration-300 shadow-lg border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 bg-card">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <CropIcon className="h-8 w-8 text-primary"/>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{crop.cropType}</CardTitle>
            <CardDescription className="text-base">{crop.fieldName}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <GitCommitHorizontal className="h-5 w-5" />
          <span>{crop.plantDevelopmentStage}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SensorCard 
                title="Temperatura" 
                icon={Thermometer}
                metrics={[
                    { label: "Ar", value: crop.airTemperature.toFixed(1), unit: "°C" },
                    { label: "Solo", value: crop.soilTemperature.toFixed(1), unit: "°C" },
                ]}
            />
            <SensorCard 
                title="Solo e Ambiente" 
                icon={Sun}
                metrics={[
                    { label: "Umidade do Solo", value: crop.soilMoisture.toFixed(1), unit: "%" },
                    { label: "Radiação Solar", value: Math.round(crop.solarRadiation), unit: "W/m²" },
                ]}
            />
            <SensorCard 
                title="Saúde da Planta" 
                icon={AreaChart}
                metrics={[
                    { label: "Índice de Vegetação", value: crop.vegetationIndex.toFixed(2), unit: "NDVI" },
                ]}
            />
        </div>
        <Separator className="my-6" />
        <div>
             <h3 className="text-xl font-semibold mb-4 text-foreground/90">Histórico de Sensores (Últimos 30 dias)</h3>
            <HistoryChart data={crop.history} />
        </div>
      </CardContent>

      {crop.alertMessage && (
        <CardFooter className="p-6 bg-destructive/10 border-t border-destructive/20">
            <Alert variant="destructive" className="w-full border-0 p-0">
              <Bot className="h-6 w-6 text-destructive" />
              <AlertTitle className="font-bold text-lg">Recomendação da IA</AlertTitle>
              <AlertDescription className="text-base text-destructive/90">{crop.alertMessage}</AlertDescription>
            </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
