
"use client";

import { useState, useEffect, useRef } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS } from "@/lib/data";
import { SensorCard } from "./sensor-card";
import { chartConfig } from "./history-chart";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { WeatherForecast } from "./weather-forecast";

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
  const [fieldImage, setFieldImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const updateCropData = async () => {
    const newAirTemp = crop.airTemperature + (Math.random() - 0.5) * 0.3;
    const newAirHumidity = crop.airHumidity + (Math.random() - 0.5) * 0.5;
    const newWindSpeed = crop.windSpeed + (Math.random() - 0.5) * 0.5;
    const newCo2Concentration = crop.co2Concentration + (Math.random() - 0.5) * 2;

    let windDirectionIndex = WIND_DIRECTIONS.indexOf(crop.windDirection);
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
    
    try {
        const alertResult = await generateAnomalyAlerts({
            cropType: crop.cropType,
            fieldName: crop.fieldName,
            ...simulatedData,
        });

        const newHistoryEntry: HistoryData = {
            time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            airTemperature: parseFloat(simulatedData.airTemperature.toFixed(1)),
            airHumidity: parseFloat(simulatedData.airHumidity.toFixed(1)),
            windSpeed: parseFloat(simulatedData.windSpeed.toFixed(1)),
            windDirection: simulatedData.windDirection,
            co2Concentration: Math.round(simulatedData.co2Concentration),
        };

        setCrop(prevCrop => ({
            ...prevCrop,
            ...simulatedData,
            history: [...prevCrop.history.slice(1), newHistoryEntry],
            alertMessage: alertResult.alertMessage,
            alertSeverity: alertResult.alertSeverity,
        }));
        
    } catch (error) {
        console.error("Error updating crop data:", error);
    }
  };

  useEffect(() => {
    setIsImageLoading(true);
    generateFieldImage(`${initialCrop.cropType} field, high resolution photograph, aerial view`)
      .then(result => {
        if (result.imageUrl) {
          setFieldImage(result.imageUrl);
        }
      })
      .catch(error => console.error("Failed to generate initial field image:", error))
      .finally(() => {
        setIsImageLoading(false);
      });
  }, [initialCrop.cropType]);

  useInterval(updateCropData, 5000);

  return (
    <div className="flex flex-col gap-6">
      <CropCard crop={crop} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <SensorCard
              title="Umidade do Solo"
              icon={Droplets}
              metric={{ label: "Umidade", value: "62.5", unit: "%" }}
              metric2={{ label: "Tensão da Água", value: "15", unit: "kPa" }}
              data={crop.history}
              dataKey="airHumidity"
              chartConfig={chartConfig}
          />
           <SensorCard
              title="Nutrientes do Solo"
              icon={Thermometer}
              metric={{ label: "Nitrogênio (N)", value: "120", unit: "ppm" }}
              metric2={{ label: "pH do Solo", value: "6.8", unit: "" }}
              data={crop.history}
              dataKey="airTemperature"
              chartConfig={chartConfig}
          />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualização do Talhão (IA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full bg-muted/50 rounded-lg overflow-hidden border flex items-center justify-center">
                {isImageLoading ? (
                   <div className="spinner"></div>
                ) : fieldImage && (
                  <Image 
                    src={fieldImage}
                    alt={`Imagem gerada por IA de ${crop.fieldName}`}
                    fill
                    className="object-cover transition-all duration-500"
                    key={fieldImage}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          <WeatherForecast />
        </div>
      </div>
    </div>
  );
}
