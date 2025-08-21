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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Map, Bell } from "lucide-react";
import { AbnormalSensors } from "./abnormal-sensors";
import { useTransition } from "@/hooks/use-transition";

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

export function DashboardClient({ initialCrop, allCrops }: { initialCrop: Crop; allCrops: Crop[] }) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [fieldImage, setFieldImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [detailedChartData, setDetailedChartData] = useState<DetailedChartDataType | null>(null);
  const [fullscreenContent, setFullscreenContent] = useState<React.ReactNode | null>(null);
  const { transitionCropId, isInitialLoad } = useTransition();

  // Efeito para aplicar uma classe de "entrada" quando o componente carrega
  useEffect(() => {
    // Pequeno atraso para permitir que a transição de zoom termine primeiro
    const timer = setTimeout(() => {
      const container = document.querySelector('.dashboard-container');
      if (container) {
        container.classList.add('fade-in');
      }
    }, isInitialLoad ? 800 : 300);

    return () => clearTimeout(timer);
  }, [isInitialLoad]);

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

  // Update the useEffect to depend on crop.cropType instead of initialCrop.cropType
  useEffect(() => {
    setIsImageLoading(true);
    generateFieldImage(`${crop.cropType} field, high resolution photograph, aerial view`)
      .then(result => {
        if (result.imageUrl) {
          setFieldImage(result.imageUrl);
        }
      })
      .catch(error => console.error("Failed to generate field image:", error))
      .finally(() => {
        setIsImageLoading(false);
      });
  }, [crop.cropType]); // Now depends on crop.cropType, not initialCrop.cropType

  useInterval(updateCropData, 5000);

  const handleMetricClick = (chartData: DetailedChartDataType) => {
    setDetailedChartData(chartData);
  }

  const metrics: (Omit<DetailedChartDataType, 'dataKey'> & { dataKey: keyof HistoryData, icon: React.ComponentType<{ className?: string }>, value: string, unit: string, value2?: string, unit2?: string })[] = [
    { title: "Temperatura do Ar", dataKey: "airTemperature", stroke: "hsl(var(--chart-1))", icon: Thermometer, value: crop.airTemperature.toFixed(1), unit: "°C" },
    { title: "Umidade do Ar", dataKey: "airHumidity", stroke: "hsl(var(--chart-2))", icon: Droplets, value: crop.airHumidity.toFixed(1), unit: "%" },
    { title: "Vento", dataKey: "windSpeed", stroke: "hsl(var(--chart-3))", icon: Wind, value: crop.windSpeed.toFixed(1), unit: "km/h", value2: crop.windDirection },
    { title: "Concentração de CO2", dataKey: "co2Concentration", stroke: "hsl(var(--foreground))", icon: Cloud, value: crop.co2Concentration.toFixed(0), unit: "ppm" },
    { title: "Umidade do Solo", dataKey: "soilMoisture", stroke: "hsl(var(--chart-4))", icon: Leaf, value: crop.soilMoisture.toFixed(1), unit: "%" },
    { title: "Nitrogênio (N)", dataKey: "nitrogen", stroke: "hsl(var(--chart-5))", icon: Waves, value: crop.nitrogen.toFixed(0), unit: "ppm" },
  ];

  // Determinar o status dos sensores com base nos valores e nos limiares
  const getSensorStatus = (name: string, value: number, threshold?: SensorThreshold) => {
    if (!threshold) return "Operacional" as const;

    if ((threshold.min !== undefined && value < threshold.min) ||
      (threshold.max !== undefined && value > threshold.max)) {
      return "Falha" as const;
    }

    return "Operacional" as const;
  };

  // Lista de sensores com seus valores e limites
  const sensorsList = [
    {
      name: "Temp. Ar",
      value: crop.airTemperature,
      unit: "°C",
      status: getSensorStatus("Temp. Ar", crop.airTemperature, crop.sensorThresholds?.airTemperature),
      threshold: crop.sensorThresholds?.airTemperature
    },
    {
      name: "Umid. Ar",
      value: crop.airHumidity,
      unit: "%",
      status: getSensorStatus("Umid. Ar", crop.airHumidity, crop.sensorThresholds?.airHumidity),
      threshold: crop.sensorThresholds?.airHumidity
    },
    {
      name: "Vento",
      value: crop.windSpeed,
      unit: "km/h",
      status: getSensorStatus("Vento", crop.windSpeed, crop.sensorThresholds?.windSpeed),
      threshold: crop.sensorThresholds?.windSpeed
    },
    {
      name: "CO2",
      value: crop.co2Concentration,
      unit: "ppm",
      status: getSensorStatus("CO2", crop.co2Concentration, crop.sensorThresholds?.co2Concentration),
      threshold: crop.sensorThresholds?.co2Concentration
    },
    {
      name: "Umid. Solo",
      value: crop.soilMoisture,
      unit: "%",
      status: getSensorStatus("Umid. Solo", crop.soilMoisture, crop.sensorThresholds?.soilMoisture),
      threshold: crop.sensorThresholds?.soilMoisture
    },
    {
      name: "Nitrogênio",
      value: crop.nitrogen,
      unit: "ppm",
      status: getSensorStatus("Nitrogênio", crop.nitrogen, crop.sensorThresholds?.nitrogen),
      threshold: crop.sensorThresholds?.nitrogen
    }
  ];

  // Add a function to handle crop changes from the dropdown
  const handleCropChange = (cropId: string) => {
    const newCrop = allCrops.find(c => c.id === cropId);
    if (newCrop) {
      // Reset states for new crop
      setFieldImage(null);
      setIsImageLoading(true);
      setDetailedChartData(null);
      setFullscreenContent(null);

      // Update the crop
      setCrop(newCrop);

      // Update the URL without full page reload
      window.history.pushState({}, '', `/dashboard/${cropId}`);
    }
  };

  return (
    <div className="flex flex-col gap-3 dashboard-container">
      <CropCard
        crop={crop}
        allCrops={allCrops}
        onCropChange={handleCropChange}
      />

      <Tabs defaultValue="sensores" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="sensores" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Sensores</span>
          </TabsTrigger>
          <TabsTrigger value="mapa" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Mapa</span>
          </TabsTrigger>
          <TabsTrigger value="alertas" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Alertas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sensores" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Previsão do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <WeatherForecast />
                </CardContent>
              </Card>

              {/* Card de Sensores Anormais reposicionado */}
              <AbnormalSensors sensors={sensorsList} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mapa" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card className="relative group min-h-[350px]">
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

            <Card className="min-h-[350px] relative group">
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
        </TabsContent>

        <TabsContent value="alertas" className="mt-0">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle className="text-base">Log de Alertas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[600px]">
              <AlertLog alerts={crop.alertHistory} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

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
