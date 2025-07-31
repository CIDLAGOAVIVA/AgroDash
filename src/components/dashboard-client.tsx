"use client";

import { useState, useEffect, useRef } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS } from "@/lib/data";

export function DashboardClient({ initialCrop }: { initialCrop: Crop }) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [fieldImage, setFieldImage] = useState<string | null>(initialCrop.imageUrl);
  const updateCounter = useRef(0);
  const isMounted = useRef(false);

  // Store crop in ref to have access to the latest state inside interval
  const cropRef = useRef(crop);
  useEffect(() => {
    cropRef.current = crop;
  }, [crop]);

  useEffect(() => {
    // Generate initial image
    generateFieldImage(`${initialCrop.cropType}, ${initialCrop.alertMessage}, ${initialCrop.alertSeverity} severity`)
      .then(result => {
          if (result.imageUrl) {
              setFieldImage(result.imageUrl);
          }
      })
      .catch(error => console.error("Failed to generate initial field image:", error));

    const interval = setInterval(async () => {
        const currentCrop = cropRef.current;

        // Simulate new sensor data
        const newAirTemp = currentCrop.airTemperature + (Math.random() - 0.5) * 0.3;
        const newAirHumidity = currentCrop.airHumidity + (Math.random() - 0.5) * 0.5;
        const newWindSpeed = currentCrop.windSpeed + (Math.random() - 0.5) * 0.5;
        const newCo2Concentration = currentCrop.co2Concentration + (Math.random() - 0.5) * 2;

        let windDirectionIndex = WIND_DIRECTIONS.indexOf(currentCrop.windDirection);
        if (Math.random() < 0.1) {
            windDirectionIndex = (windDirectionIndex + Math.floor(Math.random() * 3) - 1 + WIND_DIRECTIONS.length) % WIND_DIRECTIONS.length;
        }

        const simulatedData = {
          airTemperature: Math.max(10, Math.min(45, newAirTemp)),
          airHumidity: Math.max(30, Math.min(95, newAirHumidity)),
          windSpeed: Math.max(0, Math.min(40, newWindSpeed)),
          windDirection: WIND_DIRECTIONS[windDirectionIndex],
          co2Concentration: Math.max(380, Math.min(450, newCo2Concentration)),
        };

        const newHistoryEntry: HistoryData = {
            time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            airTemperature: parseFloat(simulatedData.airTemperature.toFixed(1)),
            airHumidity: parseFloat(simulatedData.airHumidity.toFixed(1)),
            windSpeed: parseFloat(simulatedData.windSpeed.toFixed(1)),
            windDirection: simulatedData.windDirection,
            co2Concentration: Math.round(simulatedData.co2Concentration),
        };

        const fullHistory = [...currentCrop.history.slice(1), newHistoryEntry];

        // Generate alerts and image based on new data
        try {
            const alertResult = await generateAnomalyAlerts({
                cropType: currentCrop.cropType,
                fieldName: currentCrop.fieldName,
                ...simulatedData,
            });

            // Single state update with all new data
            const finalCropData = {
                ...currentCrop,
                ...simulatedData,
                history: fullHistory,
                alertMessage: alertResult.alertMessage,
                alertSeverity: alertResult.alertSeverity,
            };
            setCrop(finalCropData);

            // Image generation logic
            updateCounter.current += 1;
            if (updateCounter.current % 12 === 0) { // roughly every 60 seconds
                 const imageResult = await generateFieldImage(`${finalCropData.cropType}, ${finalCropData.alertMessage}, ${finalCropData.alertSeverity} severity`);
                 if (imageResult.imageUrl) {
                    setFieldImage(imageResult.imageUrl);
                 }
            }
        } catch (error) {
            console.error("Error updating crop data:", error);
        }
    }, 5000);

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
                                alt={`Imagem gerada por IA de ${crop.fieldName}`}
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
