"use client";

import { useState, useEffect, useRef } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { DEVELOPMENT_STAGES } from "@/lib/data";

export function DashboardClient({ initialCrop }: { initialCrop: Crop }) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [fieldImage, setFieldImage] = useState<string | null>(crop.imageUrl);
  const updateCounter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrop(currentCrop => {
        const newSoilTemp = currentCrop.soilTemperature + (Math.random() - 0.5) * 0.2;
        const newAirTemp = currentCrop.airTemperature + (Math.random() - 0.5) * 0.3;
        const newAirHumidity = currentCrop.airHumidity + (Math.random() - 0.5) * 0.5;
        const newSoilMoisture = currentCrop.soilMoisture + (Math.random() - 0.55) * 1;
        const newSolarRadiation = currentCrop.solarRadiation + (Math.random() - 0.5) * 20;
        const newVegetationIndex = currentCrop.vegetationIndex + (Math.random() - 0.48) * 0.005;

        let stageIndex = DEVELOPMENT_STAGES.indexOf(currentCrop.plantDevelopmentStage);
        if (Math.random() < 0.01) {
          stageIndex = (stageIndex + 1) % DEVELOPMENT_STAGES.length;
        }

        const updatedCropData = {
          ...currentCrop,
          soilTemperature: Math.max(10, Math.min(40, newSoilTemp)),
          airTemperature: Math.max(10, Math.min(45, newAirTemp)),
          airHumidity: Math.max(30, Math.min(95, newAirHumidity)),
          soilMoisture: Math.max(20, Math.min(90, newSoilMoisture)),
          solarRadiation: Math.max(100, Math.min(1200, newSolarRadiation)),
          plantDevelopmentStage: DEVELOPMENT_STAGES[stageIndex],
          vegetationIndex: Math.max(0.1, Math.min(0.95, newVegetationIndex)),
        };

        const newHistoryEntry: HistoryData = {
            time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            soilTemperature: parseFloat(updatedCropData.soilTemperature.toFixed(1)),
            airTemperature: parseFloat(updatedCropData.airTemperature.toFixed(1)),
            soilMoisture: parseFloat(updatedCropData.soilMoisture.toFixed(1)),
            airHumidity: parseFloat(updatedCropData.airHumidity.toFixed(1)),
            solarRadiation: Math.round(updatedCropData.solarRadiation),
            vegetationIndex: parseFloat(updatedCropData.vegetationIndex.toFixed(2)),
        };
        
        const fullHistory = [...currentCrop.history.slice(1), newHistoryEntry];

        generateAnomalyAlerts({
            cropType: updatedCropData.cropType,
            fieldName: updatedCropData.fieldName,
            soilTemperature: updatedCropData.soilTemperature,
            airTemperature: updatedCropData.airTemperature,
            soilMoisture: updatedCropData.soilMoisture,
            solarRadiation: updatedCropData.solarRadiation,
            plantDevelopmentStage: updatedCropData.plantDevelopmentStage,
            vegetationIndex: updatedCropData.vegetationIndex,
            airHumidity: updatedCropData.airHumidity,
        }).then(alertResult => {
             setCrop(c => ({
              ...c,
              ...updatedCropData,
              alertMessage: alertResult.alertMessage,
              alertSeverity: alertResult.alertSeverity,
              history: fullHistory,
            }));
        });
        
        // Image generation logic
        updateCounter.current += 1;
        if (updateCounter.current % 12 === 0) { // roughly every 60 seconds
             generateFieldImage(`${updatedCropData.cropType}, ${updatedCropData.plantDevelopmentStage}, ${updatedCropData.alertMessage}, ${updatedCropData.alertSeverity} severity`)
              .then(result => {
                 if (result.imageUrl) {
                    setFieldImage(result.imageUrl);
                 }
              })
              .catch(error => console.error("Failed to generate field image:", error));
        }

        return updatedCropData; // returns the optimistic update
      });
    }, 5000);

    // Initial image generation
    generateFieldImage(`${initialCrop.cropType}, ${initialCrop.plantDevelopmentStage}, ${initialCrop.alertMessage}, ${initialCrop.alertSeverity} severity`)
        .then(result => {
            if (result.imageUrl) {
                setFieldImage(result.imageUrl);
            }
        })
        .catch(error => console.error("Failed to generate field image:", error));


    return () => clearInterval(interval);
  }, [initialCrop]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CropCard crop={crop} />
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Visualização do Talhão (IA)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-square w-full bg-muted/50 rounded-lg overflow-hidden border">
                        {fieldImage ? (
                             <Image 
                                src={fieldImage}
                                alt={`Imagem gerada por IA de ${crop?.fieldName}`}
                                fill
                                className="object-cover transition-all duration-500"
                                key={fieldImage}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Skeleton className="w-full h-full" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
