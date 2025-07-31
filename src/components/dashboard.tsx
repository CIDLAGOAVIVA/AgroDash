"use client";

import { useState, useEffect } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DEVELOPMENT_STAGES = ["Seedling", "Vegetative", "Flowering", "Maturity"];

const generateInitialHistory = (baseValues: { soilTemp: number; airTemp: number; soilMoisture: number }): HistoryData[] => {
  const history: HistoryData[] = [];
  let { soilTemp, airTemp, soilMoisture } = baseValues;
  for (let i = 29; i >= 0; i--) {
    const time = new Date(Date.now() - i * 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    soilTemp += (Math.random() - 0.5) * 0.2;
    airTemp += (Math.random() - 0.5) * 0.3;
    soilMoisture += (Math.random() - 0.5) * 0.5;

    history.push({
      time,
      soilTemperature: parseFloat(soilTemp.toFixed(1)),
      airTemperature: parseFloat(airTemp.toFixed(1)),
      soilMoisture: parseFloat(soilMoisture.toFixed(1)),
    });
  }
  return history;
};

const initialCrops: Crop[] = [
  {
    id: "soy-1",
    cropType: "Soybeans",
    fieldName: "North Field 7",
    soilTemperature: 22.5,
    airTemperature: 25.1,
    soilMoisture: 65.3,
    solarRadiation: 850,
    plantDevelopmentStage: "Vegetative",
    vegetationIndex: 0.78,
    history: generateInitialHistory({ soilTemp: 22.5, airTemp: 25.1, soilMoisture: 65.3 }),
    alertMessage: "",
  },
  {
    id: "corn-1",
    cropType: "Corn",
    fieldName: "East Ridge Plot",
    soilTemperature: 24.1,
    airTemperature: 26.8,
    soilMoisture: 58.9,
    solarRadiation: 920,
    plantDevelopmentStage: "Flowering",
    vegetationIndex: 0.85,
    history: generateInitialHistory({ soilTemp: 24.1, airTemp: 26.8, soilMoisture: 58.9 }),
    alertMessage: "",
  },
  {
    id: "wheat-1",
    cropType: "Wheat",
    fieldName: "Valley Bottom",
    soilTemperature: 19.8,
    airTemperature: 22.4,
    soilMoisture: 72.1,
    solarRadiation: 780,
    plantDevelopmentStage: "Seedling",
    vegetationIndex: 0.65,
    history: generateInitialHistory({ soilTemp: 19.8, airTemp: 22.4, soilMoisture: 72.1 }),
    alertMessage: "",
  },
];

export default function Dashboard() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setCrops(initialCrops);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      const updatePromises = crops.map(async (crop) => {
        // Simulate data changes
        const newSoilTemp = crop.soilTemperature + (Math.random() - 0.5) * 0.2;
        const newAirTemp = crop.airTemperature + (Math.random() - 0.5) * 0.3;
        const newSoilMoisture = crop.soilMoisture + (Math.random() - 0.55) * 1; // Tend to decrease slightly
        const newSolarRadiation = crop.solarRadiation + (Math.random() - 0.5) * 20;
        const newVegetationIndex = crop.vegetationIndex + (Math.random() - 0.48) * 0.005; // Tend to increase slightly

        let stageIndex = DEVELOPMENT_STAGES.indexOf(crop.plantDevelopmentStage);
        if (Math.random() < 0.05) { // 5% chance to change stage
          stageIndex = (stageIndex + 1) % DEVELOPMENT_STAGES.length;
        }

        const updatedCropData = {
          ...crop,
          soilTemperature: Math.max(10, Math.min(40, newSoilTemp)),
          airTemperature: Math.max(10, Math.min(45, newAirTemp)),
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
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            soilTemperature: parseFloat(updatedCropData.soilTemperature.toFixed(1)),
            airTemperature: parseFloat(updatedCropData.airTemperature.toFixed(1)),
            soilMoisture: parseFloat(updatedCropData.soilMoisture.toFixed(1)),
        };
        
        return {
          ...updatedCropData,
          alertMessage: alertResult.alertMessage,
          history: [...crop.history.slice(1), newHistoryEntry],
        };
      });

      Promise.all(updatePromises).then(newCrops => {
        setCrops(newCrops);
      });

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [crops, loading]);

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
           <Card key={i} className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-4 p-4 bg-background/50 rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-6 w-[80px]" />
                        </div>
                    </div>
                  ))}
               </div>
               <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
           </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {crops.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
    </div>
  );
}
