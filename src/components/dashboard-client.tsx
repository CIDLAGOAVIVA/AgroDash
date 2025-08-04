
"use client";

import { useState, useEffect, useRef } from "react";
import { CropCard } from "./crop-card";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS } from "@/lib/data";
import { HistoryChart } from "./history-chart";
import { Cloud, Droplets, Leaf, Thermometer, Wind, Waves } from "lucide-react";
import { WeatherForecast } from "./weather-forecast";
import { DataMetric } from "./data-metric";
import { PeriodSelector } from "./period-selector";
import { AlertLog } from "./alert-log";


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
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">('30d');

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
            alertHistory: [newAlertEntry, ...prevCrop.alertHistory].slice(0, 10),
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

  const historyData = crop.history.slice(
    period === '7d' ? -7 : period === '24h' ? -1 : -30
  );

  return (
    <div className="flex flex-col gap-6">
      <CropCard crop={crop} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                  <CardTitle>Métricas Atuais, Status e Visualização</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                      <DataMetric icon={Thermometer} label="Temp. Ar" value={crop.airTemperature.toFixed(1)} unit="°C" />
                      <DataMetric icon={Droplets} label="Umidade Ar" value={crop.airHumidity.toFixed(1)} unit="%" />
                      <DataMetric icon={Wind} label="Vento" value={`${crop.windSpeed.toFixed(1)} km/h`} unit={crop.windDirection}/>
                      <DataMetric icon={Cloud} label="CO2" value={crop.co2Concentration.toFixed(0)} unit="ppm" />
                      <DataMetric icon={Leaf} label="Umidade Solo" value={crop.soilMoisture.toFixed(1)} unit="%" />
                      <DataMetric icon={Waves} label="Nitrogênio (N)" value={crop.nitrogen.toFixed(0)} unit="ppm" />
                  </div>

                  <div className="flex flex-col gap-4">
                      <div className="relative aspect-video w-full bg-muted/50 rounded-lg overflow-hidden border flex items-center justify-center">
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
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <AlertLog alerts={crop.alertHistory} />
          </div>
      </div>


      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle>Histórico de Dados</CardTitle>
                <CardDescription>Variação das métricas ao longo do tempo.</CardDescription>
            </div>
            <PeriodSelector period={period} setPeriod={setPeriod} />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Temperatura do Ar (°C)</h3>
                <HistoryChart 
                    data={historyData} 
                    dataKey="airTemperature"
                    stroke="hsl(var(--chart-1))"
                />
            </div>
            <div>
                 <h3 className="text-base font-semibold mb-2 text-foreground">Umidade do Ar (%)</h3>
                <HistoryChart 
                    data={historyData} 
                    dataKey="airHumidity"
                    stroke="hsl(var(--chart-2))"
                />
            </div>
            <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Velocidade do Vento (km/h)</h3>
                <HistoryChart 
                    data={historyData} 
                    dataKey="windSpeed"
                    stroke="hsl(var(--chart-3))"
                />
            </div>
            <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Concentração de CO2 (ppm)</h3>
                <HistoryChart 
                    data={historyData} 
                    dataKey="co2Concentration"
                    stroke="hsl(var(--foreground))"
                />
            </div>
             <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Umidade do Solo (%)</h3>
                <HistoryChart 
                    data={historyData} 
                    dataKey="soilMoisture"
                    stroke="hsl(var(--chart-4))"
                />
            </div>
             <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Nitrogênio (N) (ppm)</h3>
                <HistoryChart 
                    data={historyData} 
                    dataKey="nitrogen"
                    stroke="hsl(var(--chart-5))"
                />
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
