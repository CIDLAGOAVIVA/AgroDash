"use client";

import { useState, useEffect, useRef } from "react";
import { generateAnomalyAlerts, generateFieldImage } from "@/app/actions";
import type { DashboardCrop, HistoryData, DashboardStation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { WIND_DIRECTIONS } from "@/lib/data";
import { Cloud, Droplets, Leaf, Thermometer, Wind, Waves, Expand, X, Wheat, Beaker, FlaskConical, Scale, Zap } from "lucide-react";
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
import { StationSelector } from "./station-selector";

// Add the Sprout component definition
const Sprout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-sprout"
  >
    <path d="M7 20h10" />
    <path d="M12 20V4" />
    <path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72" />
    <path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72" />
  </svg>
);

// Add the cropIcons mapping
const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

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


export function DashboardClient({
  initialCrop,
  allCrops,
  stations = dashboardStations // Adicione estações como prop com valor default
}: {
  initialCrop: DashboardCrop;
  allCrops: DashboardCrop[];
  stations?: DashboardStation[];
}) {
  const [crop, setCrop] = useState<DashboardCrop>(initialCrop);
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0].id);
  const [station, setStation] = useState<DashboardStation>(stations[0]);

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
    { title: "Potássio (K)", dataKey: "potassium", stroke: "hsl(var(--chart-6))", icon: Beaker, value: crop.potassium?.toFixed(0) || "N/A", unit: "ppm" },
    { title: "Fósforo (P)", dataKey: "phosphorus", stroke: "hsl(var(--chart-7))", icon: FlaskConical, value: crop.phosphorus?.toFixed(0) || "N/A", unit: "ppm" },
    { title: "Temperatura do Solo", dataKey: "soilTemperature", stroke: "hsl(var(--chart-8))", icon: Thermometer, value: crop.soilTemperature?.toFixed(1) || "N/A", unit: "°C" },
    { title: "pH do Solo", dataKey: "soilPH", stroke: "hsl(var(--chart-9))", icon: Scale, value: crop.soilPH?.toFixed(1) || "N/A", unit: "" },
    { title: "Condutividade Elétrica", dataKey: "electricalConductivity", stroke: "hsl(var(--chart-10))", icon: Zap, value: crop.electricalConductivity?.toFixed(2) || "N/A", unit: "mS/cm" }
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
      value: station.sensors.airTemperature,
      unit: "°C",
      status: getSensorStatus("Temp. Ar", station.sensors.airTemperature, station.sensorThresholds?.airTemperature),
      threshold: station.sensorThresholds?.airTemperature
    },
    {
      name: "Umid. Ar",
      value: station.sensors.airHumidity,
      unit: "%",
      status: getSensorStatus("Umid. Ar", station.sensors.airHumidity, station.sensorThresholds?.airHumidity),
      threshold: station.sensorThresholds?.airHumidity
    },
    {
      name: "Vento",
      value: station.sensors.windSpeed,
      unit: "km/h",
      status: getSensorStatus("Vento", station.sensors.windSpeed, station.sensorThresholds?.windSpeed),
      threshold: station.sensorThresholds?.windSpeed
    },
    {
      name: "CO2",
      value: station.sensors.co2Concentration,
      unit: "ppm",
      status: getSensorStatus("CO2", station.sensors.co2Concentration, station.sensorThresholds?.co2Concentration),
      threshold: station.sensorThresholds?.co2Concentration
    },
    {
      name: "Umid. Solo",
      value: station.sensors.soilMoisture,
      unit: "%",
      status: getSensorStatus("Umid. Solo", station.sensors.soilMoisture, station.sensorThresholds?.soilMoisture),
      threshold: station.sensorThresholds?.soilMoisture
    },
    {
      name: "Nitrogênio",
      value: station.sensors.nitrogen,
      unit: "ppm",
      status: getSensorStatus("Nitrogênio", station.sensors.nitrogen, station.sensorThresholds?.nitrogen),
      threshold: station.sensorThresholds?.nitrogen
    }
  ];

  // Add a function to handle crop changes from the dropdown
  const handleCropChange = (cropId: string) => {
    // The transition animation is already started by the CropCard component
    // We just need to wait for it and then update the crop data
    const newCrop = allCrops.find(c => c.id === cropId);
    if (newCrop) {
      // Reset states for new crop
      setFieldImage(null);
      setIsImageLoading(true);
      setDetailedChartData(null);
      setFullscreenContent(null);

      // Update the crop
      setCrop(newCrop);
    }
  };

  // Adicione esta função para lidar com mudanças de estação
  const handleStationChange = (stationId: string) => {
    const newStation = stations.find(s => s.id === stationId);
    if (newStation) {
      setSelectedStationId(stationId);
      setStation(newStation);

      // Reset states para nova estação
      setFieldImage(null);
      setIsImageLoading(true);
      setDetailedChartData(null);
      setFullscreenContent(null);

      // Gerar nova imagem para a estação
      setIsImageLoading(true);
      generateFieldImage(`Weather monitoring station, high resolution photograph, ${newStation.name}`)
        .then(result => {
          if (result.imageUrl) {
            setFieldImage(result.imageUrl);
          }
        })
        .finally(() => setIsImageLoading(false));
    }
  };

  // Modifique o useEffect para usar station em vez de crop
  useEffect(() => {
    setIsImageLoading(true);
    generateFieldImage(`Weather monitoring station, high resolution photograph, ${station.name}`)
      .then(result => {
        if (result.imageUrl) {
          setFieldImage(result.imageUrl);
        }
      })
      .finally(() => setIsImageLoading(false));
  }, [station.name]);

  // Modificar simulateDataUpdate para usar station
  const simulateDataUpdate = async () => {
    try {
      // Simular flutuações aleatórias nos dados dos sensores
      const simulatedData = {
        sensors: {
          airTemperature: station.sensors.airTemperature + (Math.random() * 2 - 1),
          airHumidity: Math.max(0, Math.min(100, station.sensors.airHumidity + (Math.random() * 6 - 3))),
          windSpeed: Math.max(0, station.sensors.windSpeed + (Math.random() * 4 - 2)),
          windDirection: WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)],
          co2Concentration: Math.max(350, station.sensors.co2Concentration + (Math.random() * 20 - 10)),
          soilMoisture: Math.max(0, Math.min(100, station.sensors.soilMoisture + (Math.random() * 4 - 2))),
          nitrogen: Math.max(0, station.sensors.nitrogen + (Math.random() * 10 - 5)),
        }
      };

      const newHistoryEntry: HistoryData = {
        time: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        airTemperature: parseFloat(simulatedData.sensors.airTemperature.toFixed(1)),
        airHumidity: parseFloat(simulatedData.sensors.airHumidity.toFixed(1)),
        windSpeed: parseFloat(simulatedData.sensors.windSpeed.toFixed(1)),
        windDirection: simulatedData.sensors.windDirection,
        co2Concentration: Math.round(simulatedData.sensors.co2Concentration),
        soilMoisture: parseFloat(simulatedData.sensors.soilMoisture.toFixed(1)),
        nitrogen: Math.round(simulatedData.sensors.nitrogen),
      };

      const now = new Date();
      const newAlertEntry = {
        dateTime: `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        message: "Dados simulados atualizados",
        severity: "info",
      };

      // Atualizar dados
      setStation(prevStation => ({
        ...prevStation,
        ...simulatedData,
        history: [...prevStation.history.slice(1), newHistoryEntry],
        alertHistory: [newAlertEntry, ...prevStation.alertHistory].slice(0, 20),
      }));

    } catch (error) {
      console.error("Error updating station data:", error);
    }
  };

  // Modificar o componente no return para incluir o seletor de estações
  return (
    <div className="flex flex-col gap-3 dashboard-container">
      {/* Substitui o card de cultura pelo seletor de estações */}
      <StationSelector
        stations={stations}
        selectedStationId={selectedStationId}
        onStationChange={handleStationChange}
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
