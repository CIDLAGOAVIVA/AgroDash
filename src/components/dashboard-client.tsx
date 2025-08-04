
"use client";

import { useState, useEffect, useRef } from "react";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { Crop, HistoryData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS } from "@/lib/data";
import { Cloud, Droplets, Leaf, Thermometer, Wind, Waves, Expand, X } from "lucide-react";
import { AlertLog } from "./alert-log";
import { DataMetric } from "./data-metric";
import { DetailedChartModal } from "./detailed-chart-modal";
import { CropCard } from "./crop-card";
import { WeatherForecast } from "./weather-forecast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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

const SatelliteMap = ({ lat, lng, onFullscreen }: { lat: number; lng: number; onFullscreen: () => void }) => {
  const zoom = 15;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
      <Card className="h-full relative group">
          <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src={mapUrl}
              title="Mapa de Satélite"
          ></iframe>
          <button onClick={onFullscreen} className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="h-5 w-5" />
          </button>
      </Card>
  );
};

const FullscreenModal = ({ content, onClose }: { content: React.ReactNode, onClose: () => void }) => {
  if (!content) return null;

  return (
    <Dialog open={!!content} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="p-0 border-0 max-w-none w-screen h-screen">
          <DialogHeader className="sr-only">
            <DialogTitle>Visualização em Tela Cheia</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full">
            {content}
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
    </Dialog>
  )
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
  const [fullscreenContent, setFullscreenContent] = useState<React.ReactNode | null>(null);

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

        const now = new Date();
        const newAlertEntry = {
          dateTime: `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
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
    <div className="flex flex-col gap-3">
      <CropCard crop={crop} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

        <div className="lg:col-span-1 flex flex-col gap-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Métricas dos Sensores</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
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
                    <WeatherForecast />
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-[500px] lg:min-h-0">
            <Card className="flex-grow relative group">
                <CardHeader className="absolute top-0 left-0 z-10 p-2">
                    <CardTitle className="text-sm bg-black/40 text-white px-2 py-1 rounded">Imagem do Campo (IA)</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full w-full">
                {isImageLoading ? (
                  <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded-lg border">
                    <div className="spinner"></div>
                  </div>
                ) : fieldImage && (
                  <>
                    <Image 
                      src={fieldImage}
                      alt={`Imagem gerada por IA de ${crop.fieldName}`}
                      fill
                      className="object-cover transition-all duration-500 rounded-lg"
                      key={fieldImage}
                      data-ai-hint="agriculture field"
                    />
                    <button onClick={() => setFullscreenContent(
                      <Image 
                        src={fieldImage}
                        alt={`Imagem gerada por IA de ${crop.fieldName}`}
                        fill
                        className="object-contain"
                      />
                    )} className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="h-5 w-5" />
                    </button>
                  </>
                )}
                </CardContent>
            </Card>
             <Card className="h-1/2 min-h-[250px] relative group">
                <CardHeader className="absolute top-0 left-0 z-10 p-2">
                    <CardTitle className="text-sm bg-black/40 text-white px-2 py-1 rounded">Mapa de Satélite</CardTitle>
                </CardHeader>
                 <CardContent className="p-0 h-full w-full">
                    <SatelliteMap lat={crop.location.lat} lng={crop.location.lng} onFullscreen={() => setFullscreenContent(
                        <iframe
                            className="absolute top-0 left-0 w-full h-full border-0"
                            src={`https://maps.google.com/maps?q=${crop.location.lat},${crop.location.lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                            title="Mapa de Satélite em Tela Cheia"
                        ></iframe>
                    )} />
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-grow">
                <CardHeader>
                    <CardTitle className="text-base">Log de Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                    <AlertLog alerts={crop.alertHistory} />
                </CardContent>
            </Card>
        </div>

      </div>

      <DetailedChartModal 
        isOpen={!!detailedChartData}
        onClose={() => setDetailedChartData(null)}
        title={detailedChartData?.title || ""}
        dataKey={detailedChartData?.dataKey}
        data={crop.history}
        stroke={detailedChartData?.stroke || ""}
      />

      <FullscreenModal 
        content={fullscreenContent}
        onClose={() => setFullscreenContent(null)}
      />

    </div>
  );
}
