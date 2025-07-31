"use client"

import { Leaf, Sun, Thermometer, Droplets, GitCommitHorizontal, Wind, Wheat, Bot, ShieldAlert, ShieldCheck, ShieldX, Cloud, Compass } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SensorCard } from "./sensor-card";
import type { Crop } from "@/types";
import { chartConfig } from "./history-chart";
import { cn } from "@/lib/utils";

const Sprout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10"/><path d="M12 20V4"/><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72"/><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72"/></svg>
)

const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

const severityConfig = {
    "Normal": {
        icon: ShieldCheck,
        className: "bg-primary/10 border-primary/20 text-primary",
        title: "Status: Normal",
        iconColor: "text-primary"
    },
    "Atenção": {
        icon: ShieldAlert,
        className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500",
        title: "Status: Atenção",
        iconColor: "text-yellow-500"
    },
    "Crítico": {
        icon: ShieldX,
        className: "bg-destructive/10 border-destructive/20 text-destructive",
        title: "Status: Crítico",
        iconColor: "text-destructive"
    }
}

type CropCardProps = {
  crop: Crop;
};

export function CropCard({ crop }: CropCardProps) {
  const CropIcon = cropIcons[crop.cropType] || Leaf;
  const currentSeverity = crop.alertSeverity || "Normal";
  const config = severityConfig[currentSeverity];
  const AlertIcon = config.icon;

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
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
             <SensorCard
                title="Clima e Ambiente"
                icon={Wind}
                metric={{ label: "Temp. do Ar", value: crop.airTemperature.toFixed(1), unit: "°C" }}
                metric2={{ label: "Umidade do Ar", value: crop.airHumidity.toFixed(1), unit: "%" }}
                data={crop.history}
                dataKey="airTemperature"
                chartConfig={chartConfig}
            />
            <SensorCard
                title="Atmosfera"
                icon={Cloud}
                metric={{ label: "Concentração CO2", value: crop.co2Concentration.toFixed(0), unit: "ppm" }}
                metric2={{ label: "Vento", value: `${crop.windSpeed.toFixed(1)} km/h`, unit: crop.windDirection }}
                data={crop.history}
                dataKey="co2Concentration"
                chartConfig={chartConfig}
            />
        </div>
      </CardContent>
        <CardFooter className={cn("p-6 border-t", config.className)}>
             <Alert variant="default" className="w-full border-0 p-0 bg-transparent flex items-start">
              <AlertIcon className={cn("h-6 w-6 mt-1", config.iconColor)} />
              <div className="ml-4">
                <AlertTitle className="font-bold text-lg">{config.title}</AlertTitle>
                <AlertDescription className="text-base">{crop.alertMessage}</AlertDescription>
              </div>
            </Alert>
        </CardFooter>
    </Card>
  );
}
