"use client";

import { useState, useEffect } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { DEVELOPMENT_STAGES } from "@/lib/data";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

export function DashboardClient({ initialCrop }: { initialCrop: Crop }) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [loading, setLoading] = useState(false);
  const [fieldImage, setFieldImage] = useState<string | null>(crop.imageUrl);

  useEffect(() => {
    const interval = setInterval(() => {
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

      const newHistoryEntry: HistoryData = {
          time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          soilTemperature: parseFloat(updatedCropData.soilTemperature.toFixed(1)),
          airTemperature: parseFloat(updatedCropData.airTemperature.toFixed(1)),
          soilMoisture: parseFloat(updatedCropData.soilMoisture.toFixed(1)),
          airHumidity: parseFloat(updatedCropData.airHumidity.toFixed(1)),
          solarRadiation: Math.round(updatedCropData.solarRadiation),
          vegetationIndex: parseFloat(updatedCropData.vegetationIndex.toFixed(2)),
      };
      
      const fullHistory = [...crop.history.slice(1), newHistoryEntry];

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
           setCrop({
            ...updatedCropData,
            alertMessage: alertResult.alertMessage,
            alertSeverity: alertResult.alertSeverity,
            history: fullHistory,
          });
      })
    }, 5000);

    return () => clearInterval(interval);
  }, [crop]);
  
  useEffect(() => {
    const imageGenerationInterval = setInterval(() => {
        generateFieldImage(`${crop.cropType}, ${crop.plantDevelopmentStage}, ${crop.alertMessage}, ${crop.alertSeverity} severity`)
          .then(result => {
             if (result.imageUrl) {
                setFieldImage(result.imageUrl);
             }
          })
          .catch(error => console.error("Failed to generate field image:", error));
    }, 60000);

    // Initial image generation
    generateFieldImage(`${crop.cropType}, ${crop.plantDevelopmentStage}, ${crop.alertMessage}, ${crop.alertSeverity} severity`)
      .then(result => {
          if (result.imageUrl) {
            setFieldImage(result.imageUrl);
          }
      })
      .catch(error => console.error("Failed to generate field image:", error));

    return () => clearInterval(imageGenerationInterval);

  }, []);


  if (loading) {
    return <LoadingSkeleton />;
  }

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
