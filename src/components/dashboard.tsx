"use client";

import { useState, useEffect } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DEVELOPMENT_STAGES = ["Muda", "Vegetativo", "Floração", "Maturidade"];

const generateInitialHistory = (baseValues: { soilTemp: number; airTemp: number; soilMoisture: number; airHumidity: number; solarRadiation: number; vegetationIndex: number }): HistoryData[] => {
  const history: HistoryData[] = [];
  let { soilTemp, airTemp, soilMoisture, airHumidity, solarRadiation, vegetationIndex } = baseValues;
  for (let i = 29; i >= 0; i--) {
    const time = new Date(Date.now() - i * 24 * 60 * 60000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    soilTemp += (Math.random() - 0.5) * 0.4;
    airTemp += (Math.random() - 0.5) * 0.6;
    soilMoisture += (Math.random() - 0.5) * 1;
    airHumidity += (Math.random() - 0.5) * 1.5;
    solarRadiation += (Math.random() - 0.5) * 40;
    vegetationIndex += (Math.random() - 0.5) * 0.01;


    history.push({
      time,
      soilTemperature: parseFloat(soilTemp.toFixed(1)),
      airTemperature: parseFloat(airTemp.toFixed(1)),
      soilMoisture: parseFloat(soilMoisture.toFixed(1)),
      airHumidity: parseFloat(airHumidity.toFixed(1)),
      solarRadiation: Math.round(solarRadiation),
      vegetationIndex: parseFloat(vegetationIndex.toFixed(2)),
    });
  }
  return history;
};

const initialCrops: Crop[] = [
  {
    id: "soy-1",
    cropType: "Soja",
    fieldName: "Campo Norte 7",
    soilTemperature: 22.5,
    airTemperature: 25.1,
    airHumidity: 75.2,
    soilMoisture: 65.3,
    solarRadiation: 850,
    plantDevelopmentStage: "Vegetativo",
    vegetationIndex: 0.78,
    history: generateInitialHistory({ soilTemp: 22.5, airTemp: 25.1, soilMoisture: 65.3, airHumidity: 75.2, solarRadiation: 850, vegetationIndex: 0.78 }),
    alertMessage: "Condições ideais para o desenvolvimento vegetativo. Nenhuma ação necessária.",
    alertSeverity: "Normal",
  },
  {
    id: "corn-1",
    cropType: "Milho",
    fieldName: "Lote Cume Leste",
    soilTemperature: 24.1,
    airTemperature: 26.8,
    airHumidity: 72.8,
    soilMoisture: 58.9,
    solarRadiation: 920,
    plantDevelopmentStage: "Floração",
    vegetationIndex: 0.85,
    history: generateInitialHistory({ soilTemp: 24.1, airTemp: 26.8, soilMoisture: 58.9, airHumidity: 72.8, solarRadiation: 920, vegetationIndex: 0.85 }),
    alertMessage: "A umidade do solo está ligeiramente abaixo do ideal para a floração. Monitore a irrigação.",
    alertSeverity: "Atenção",
  },
  {
    id: "wheat-1",
    cropType: "Trigo",
    fieldName: "Fundo do Vale",
    soilTemperature: 19.8,
    airTemperature: 22.4,
    airHumidity: 80.5,
    soilMoisture: 72.1,
    solarRadiation: 780,
    plantDevelopmentStage: "Muda",
    vegetationIndex: 0.65,
    history: generateInitialHistory({ soilTemp: 19.8, airTemp: 22.4, soilMoisture: 72.1, airHumidity: 80.5, solarRadiation: 780, vegetationIndex: 0.65 }),
    alertMessage: "Alta umidade do ar e temperatura moderada podem favorecer o surgimento de doenças fúngicas.",
    alertSeverity: "Crítico",
  },
];

const LoadingSkeleton = () => (
    <Card className="w-full overflow-hidden shadow-lg">
     <CardHeader className="p-6 bg-card">
       <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
       </div>
     </CardHeader>
     <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i}><CardContent className="p-6 space-y-4">
                     <div className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-1/3" />
                     </div>
                     <Skeleton className="h-6 w-1/2 mb-4" />
                     <Skeleton className="h-4 w-3/4 mb-2" />
                     <Skeleton className="h-[120px] w-full" />
                </CardContent></Card>
            ))}
        </div>
     </CardContent>
    </Card>
)

export default function Dashboard() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCrops(initialCrops);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || crops.length === 0) return;

    const interval = setInterval(() => {
      const updatePromises = crops.map(async (crop) => {
        // Simulate data changes
        const newSoilTemp = crop.soilTemperature + (Math.random() - 0.5) * 0.2;
        const newAirTemp = crop.airTemperature + (Math.random() - 0.5) * 0.3;
        const newAirHumidity = crop.airHumidity + (Math.random() - 0.5) * 0.5;
        const newSoilMoisture = crop.soilMoisture + (Math.random() - 0.55) * 1;
        const newSolarRadiation = crop.solarRadiation + (Math.random() - 0.5) * 20;
        const newVegetationIndex = crop.vegetationIndex + (Math.random() - 0.48) * 0.005;

        let stageIndex = DEVELOPMENT_STAGES.indexOf(crop.plantDevelopmentStage);
        if (Math.random() < 0.01) {
          stageIndex = (stageIndex + 1) % DEVELOPMENT_STAGES.length;
        }

        const updatedCropData = {
          ...crop,
          soilTemperature: Math.max(10, Math.min(40, newSoilTemp)),
          airTemperature: Math.max(10, Math.min(45, newAirTemp)),
          airHumidity: Math.max(30, Math.min(95, newAirHumidity)),
          soilMoisture: Math.max(20, Math.min(90, newSoilMoisture)),
          solarRadiation: Math.max(100, Math.min(1200, newSolarRadiation)),
          plantDevelopmentStage: DEVELOPMENT_STAGES[stageIndex],
          vegetationIndex: Math.max(0.1, Math.min(0.95, newVegetationIndex)),
        };

        const alertResult = await generateAnomalyAlerts({
          cropType: updatedCropData.cropType,
          fieldName: updatedCropData.fieldName,
          soilTemperature: updatedCropData.soilTemperature,
          airTemperature: updatedCropData.airTemperature,
          soilMoisture: updatedCropData.soilMoisture,
          solarRadiation: updatedCropData.solarRadiation,
          plantDevelopmentStage: updatedCropData.plantDevelopmentStage,
          vegetationIndex: updatedCropData.vegetationIndex,
        });

        const newHistoryEntry: HistoryData = {
            time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            soilTemperature: parseFloat(updatedCropData.soilTemperature.toFixed(1)),
            airTemperature: parseFloat(updatedCropData.airTemperature.toFixed(1)),
            soilMoisture: parseFloat(updatedCropData.soilMoisture.toFixed(1)),
            airHumidity: parseFloat(updatedCropData.airHumidity.toFixed(1)),
            solarRadiation: Math.round(updatedCropData.solarRadiation),
            vegetationIndex: parseFloat(updatedCropData.vegetationIndex.toFixed(2)),
        };

        return {
          ...updatedCropData,
          alertMessage: alertResult.alertMessage,
          alertSeverity: alertResult.alertSeverity,
          history: [...crop.history.slice(1), newHistoryEntry],
        };
      });

      Promise.all(updatePromises).then(newCrops => {
        setCrops(newCrops);
      });

    }, 5000);

    return () => clearInterval(interval);
  }, [crops, loading]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Tabs defaultValue={initialCrops[0].id} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-primary/5 border border-primary/10">
        {crops.map((crop) => (
          <TabsTrigger key={crop.id} value={crop.id} className="py-2.5 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">{crop.cropType}</TabsTrigger>
        ))}
      </TabsList>
      {crops.map((crop) => (
        <TabsContent key={crop.id} value={crop.id} className="mt-4">
          <CropCard crop={crop} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
