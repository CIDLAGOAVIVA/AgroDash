
"use client";

import { useState, useEffect, useRef } from "react";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS, initialCrops } from "@/lib/data";
import { Cloud, Droplets, Leaf, Thermometer, Wind, Waves } from "lucide-react";
import { AlertLog } from "./alert-log";
import { DataMetric } from "./data-metric";
import { DetailedChartModal } from "./detailed-chart-modal";
import { CropCard } from "./crop-card";
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

type DetailedChartDataType = {
  title: string;
  dataKey: keyof Omit<HistoryData, 'time' | 'windDirection'>;
  stroke: string;
}

export function DashboardClient({ initialCrop }: { initialCrop: Crop }) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [fieldImage, setFieldImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [detailedChartData, setDetailedChartData] = useState<DetailedChartDataType | null>(null);

  const updateCropData = async () => {
    const newAirTemp = crop.airTemperature + (Math.random() - 0.5) * 0.3;
    const newAirHumidity = crop.airHumidity + (Math.random() - 0.5) * 0.5;
    const newWindSpeed = crop.windSpeed + (Math.random() - 0.5) * 0.5;
    const newCo2Concentration = crop.co2Concentration + (Math.random() - 0.5) * 2;
    const newSoilMoisture = crop.soilMoisture + (Math.random() - 0.5) * 0.5;
    const newNitrogen = crop.nitrogen + (Math.random() - 0.5) * 1;


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
      soilMoisture: Math.max(20, Math.min(80, newSoilMoisture)),
      nitrogen: Math.max(50, Math.min(250, newNitrogen)),
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
            soilMoisture: parseFloat(simulatedData.soilMoisture.toFixed(1)),
            nitrogen: Math.round(simulatedData.nitrogen),
        };

        const newAlertEntry = {
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          message: alertResult.alertMessage,
          severity: alertResult.alertSeverity,
        };

        setCrop(prevCrop => ({
            ...prevCrop,
            ...simulatedData,
            history: [...prevCrop.history.slice(1), newHistoryEntry],
            alertHistory: [newAlertEntry, ...prevCrop.alertHistory].slice(0, 20),
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

  const handleMetricClick = (chartData: DetailedChartDataType) => {
    setDetailedChartData(chartData);
  }

  const metrics: (Omit<DetailedChartDataType, 'dataKey'> & { dataKey: keyof HistoryData, icon: React.ComponentType<{ className?: string }>, value: string, unit: string, value2?: string, unit2?: string})[] = [
    { title: "Temperatura do Ar", dataKey: "airTemperature", stroke: "hsl(var(--chart-1))", icon: Thermometer, value: crop.airTemperature.toFixed(1), unit: "°C" },
    { title: "Umidade do Ar", dataKey: "airHumidity", stroke: "hsl(var(--chart-2))", icon: Droplets, value: crop.airHumidity.toFixed(1), unit: "%" },
    { title: "Vento", dataKey: "windSpeed", stroke: "hsl(var(--chart-3))", icon: Wind, value: crop.windSpeed.toFixed(1), unit: "km/h", value2: crop.windDirection },
    { title: "Concentração de CO2", dataKey: "co2Concentration", stroke: "hsl(var(--foreground))", icon: Cloud, value: crop.co2Concentration.toFixed(0), unit: "ppm" },
    { title: "Umidade do Solo", dataKey: "soilMoisture", stroke: "hsl(var(--chart-4))", icon: Leaf, value: crop.soilMoisture.toFixed(1), unit: "%" },
    { title: "Nitrogênio (N)", dataKey: "nitrogen", stroke: "hsl(var(--chart-5))", icon: Waves, value: crop.nitrogen.toFixed(0), unit: "ppm" },
  ];


  return (
    <div className="flex flex-col gap-6">
      <CropCard crop={crop} />
      
      <Card>
        <CardHeader>
          <CardTitle>Métricas e Visualização do Campo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="flex flex-col gap-4">
              {metrics.map((metric) => (
                <DataMetric
                  key={metric.title}
                  icon={metric.icon}
                  label={metric.title}
                  value={metric.value}
                  unit={metric.unit}
                  value2={metric.value2}
                  unit2={metric.unit2}
                  onClick={() => handleMetricClick(metric)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative w-full bg-muted/50 rounded-lg overflow-hidden border flex items-center justify-center flex-grow">
                {isImageLoading ? (
                  <div className="spinner"></div>
                ) : fieldImage && (
                  <Image 
                    src={fieldImage}
                    alt={`Imagem gerada por IA de ${crop.fieldName}`}
                    fill
                    className="object-cover transition-all duration-500"
                    key={fieldImage}
                    data-ai-hint="agriculture field"
                  />
                )}
              </div>
              <WeatherForecast />
            </div>
            
            <div className="h-full">
                <AlertLog alerts={crop.alertHistory} />
            </div>

          </div>
        </CardContent>
      </Card>

      <DetailedChartModal 
        isOpen={!!detailedChartData}
        onClose={() => setDetailedChartData(null)}
        title={detailedChartData?.title || ""}
        dataKey={detailedChartData?.dataKey}
        data={crop.history}
        stroke={detailedChartData?.stroke || ""}
      />

    </div>
  );
}
