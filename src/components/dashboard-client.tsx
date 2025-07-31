"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS } from "@/lib/data";

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function DashboardClient({ initialCrop }: { initialCrop: Crop }) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [fieldImage, setFieldImage] = useState<string | null>(initialCrop.imageUrl);
  const updateCounter = useRef(0);

  const updateCropData = useCallback(async () => {
    try {
      const currentCrop = crop;

      // 1. Simulate new sensor data
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

      // 2. Get AI anomaly alert
      const alertResult = await generateAnomalyAlerts({
        cropType: currentCrop.cropType,
        fieldName: currentCrop.fieldName,
        ...simulatedData,
      });

      // 3. Create new history entry
      const newHistoryEntry: HistoryData = {
        time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        airTemperature: parseFloat(simulatedData.airTemperature.toFixed(1)),
        airHumidity: parseFloat(simulatedData.airHumidity.toFixed(1)),
        windSpeed: parseFloat(simulatedData.windSpeed.toFixed(1)),
        windDirection: simulatedData.windDirection,
        co2Concentration: Math.round(simulatedData.co2Concentration),
      };

      // 4. Update crop state once with all new data
      setCrop({
        ...currentCrop,
        ...simulatedData,
        history: [...currentCrop.history.slice(1), newHistoryEntry],
        alertMessage: alertResult.alertMessage,
        alertSeverity: alertResult.alertSeverity,
      });

      // 5. Update image periodically
      updateCounter.current += 1;
      if (updateCounter.current % 12 === 0) {
        const imageResult = await generateFieldImage(`${currentCrop.cropType}, ${alertResult.alertMessage}, ${alertResult.alertSeverity} severity`);
        if (imageResult.imageUrl) {
          setFieldImage(imageResult.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error updating crop data:", error);
    }
  }, [crop]);

  useEffect(() => {
    // Generate the initial image when the component mounts
    generateFieldImage(`${initialCrop.cropType}, ${initialCrop.alertMessage}, ${initialCrop.alertSeverity} severity`)
      .then(result => {
        if (result.imageUrl) {
          setFieldImage(result.imageUrl);
        }
      })
      .catch(error => console.error("Failed to generate initial field image:", error));
  }, [initialCrop]);

  useInterval(updateCropData, 5000);

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