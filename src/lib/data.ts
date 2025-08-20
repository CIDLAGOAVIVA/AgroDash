import type { Crop, HistoryData } from "@/types";
import type { ChartConfig } from "@/components/ui/chart"

export const WIND_DIRECTIONS = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];

export const generateInitialHistory = (baseValues: {
  airTemp: number;
  airHumidity: number;
  windSpeed: number;
  co2Concentration: number;
  soilMoisture: number;
  nitrogen: number;
}): HistoryData[] => {
  const history: HistoryData[] = [];
  let { airTemp, airHumidity, windSpeed, co2Concentration, soilMoisture, nitrogen } = baseValues;
  for (let i = 29; i >= 0; i--) {
    const time = new Date(Date.now() - i * 24 * 60 * 60000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    // Simulate fluctuations
    airTemp += (Math.random() - 0.5) * 0.6;
    airHumidity += (Math.random() - 0.5) * 1.5;
    windSpeed += (Math.random() - 0.5) * 0.5;
    co2Concentration += (Math.random() - 0.5) * 2;
    soilMoisture += (Math.random() - 0.5) * 1;
    nitrogen += (Math.random() - 0.5) * 2;
    const windDirection = WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)];

    history.push({
      time,
      airTemperature: parseFloat(airTemp.toFixed(1)),
      airHumidity: parseFloat(airHumidity.toFixed(1)),
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      windDirection: windDirection,
      co2Concentration: Math.round(co2Concentration),
      soilMoisture: parseFloat(soilMoisture.toFixed(1)),
      nitrogen: Math.round(nitrogen),
    });
  }
  return history;
};

const getCurrentDateTime = () => {
  const now = new Date();
  return `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

const getPastDateTime = (minutes: number) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - minutes);
  return `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}


const baseHistorySoy = { airTemp: 25.1, airHumidity: 75.2, windSpeed: 10.5, co2Concentration: 400, soilMoisture: 65, nitrogen: 150 };
const baseHistoryCorn = { airTemp: 26.8, airHumidity: 72.8, windSpeed: 12.3, co2Concentration: 410, soilMoisture: 60, nitrogen: 180 };
const baseHistoryWheat = { airTemp: 22.4, airHumidity: 80.5, windSpeed: 8.1, co2Concentration: 390, soilMoisture: 70, nitrogen: 130 };

export const initialCrops: Crop[] = [
  {
    id: "soy-1",
    cropType: "Soja",
    fieldName: "Campo Norte 7",
    airTemperature: baseHistorySoy.airTemp,
    airHumidity: baseHistorySoy.airHumidity,
    windSpeed: baseHistorySoy.windSpeed,
    windDirection: "NE",
    co2Concentration: baseHistorySoy.co2Concentration,
    soilMoisture: baseHistorySoy.soilMoisture,
    nitrogen: baseHistorySoy.nitrogen,
    history: generateInitialHistory(baseHistorySoy),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Condições ideais para o desenvolvimento vegetativo. Nenhuma ação necessária.", severity: "Normal" },
      { dateTime: getPastDateTime(90), message: "Leve aumento na temperatura, mas dentro da faixa segura.", severity: "Normal" },
      { dateTime: getPastDateTime(240), message: "Irrigação concluída com sucesso.", severity: "Normal" },
    ],
    location: { lat: -22.846146, lng: -42.571864 },
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Soja",
    sensorThresholds: {
      airTemperature: { min: 20, max: 30 },
      airHumidity: { min: 40, max: 80 },
      windSpeed: { max: 20 },
      co2Concentration: { min: 350, max: 450 },
      soilMoisture: { min: 30, max: 60 },
      nitrogen: { min: 30, max: 60 }
    }
  },
  {
    id: "corn-1",
    cropType: "Milho",
    fieldName: "Lote Leste Cume",
    airTemperature: baseHistoryCorn.airTemp,
    airHumidity: baseHistoryCorn.airHumidity,
    windSpeed: baseHistoryCorn.windSpeed,
    windDirection: "L",
    co2Concentration: baseHistoryCorn.co2Concentration,
    soilMoisture: baseHistoryCorn.soilMoisture,
    nitrogen: baseHistoryCorn.nitrogen,
    history: generateInitialHistory(baseHistoryCorn),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "A umidade do solo está ligeiramente abaixo do ideal para a floração. Monitore a irrigação.", severity: "Atenção" },
      { dateTime: getPastDateTime(180), message: "Velocidade do vento aumentou, sem risco imediato.", severity: "Normal" },
      { dateTime: getPastDateTime(300), message: "Níveis de Nitrogênio estáveis.", severity: "Normal" },
    ],
    location: { lat: -22.85, lng: -42.565 },
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Milho",
    sensorThresholds: {
      airTemperature: { min: 15, max: 35 },
      airHumidity: { min: 50, max: 90 },
      windSpeed: { max: 25 },
      co2Concentration: { min: 300, max: 500 },
      soilMoisture: { min: 20, max: 70 },
      nitrogen: { min: 20, max: 70 }
    }
  },
  {
    id: "wheat-1",
    cropType: "Trigo",
    fieldName: "Fundo do Vale",
    airTemperature: baseHistoryWheat.airTemp,
    airHumidity: baseHistoryWheat.airHumidity,
    windSpeed: baseHistoryWheat.windSpeed,
    windDirection: "SO",
    co2Concentration: baseHistoryWheat.co2Concentration,
    soilMoisture: baseHistoryWheat.soilMoisture,
    nitrogen: baseHistoryWheat.nitrogen,
    history: generateInitialHistory(baseHistoryWheat),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Risco de doença fúngica detectado devido à alta umidade e temperatura. Ação preventiva recomendada.", severity: "Crítico" },
      { dateTime: getPastDateTime(120), message: "Umidade do ar persistentemente alta.", severity: "Atenção" },
      { dateTime: getPastDateTime(240), message: "Condições ideais para o desenvolvimento vegetativo.", severity: "Normal" },
    ],
    location: { lat: -22.84, lng: -42.58 },
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Trigo",
    sensorThresholds: {
      airTemperature: { min: 10, max: 25 },
      airHumidity: { min: 60, max: 85 },
      windSpeed: { max: 15 },
      co2Concentration: { min: 350, max: 450 },
      soilMoisture: { min: 25, max: 75 },
      nitrogen: { min: 10, max: 50 }
    }
  },
];


export const chartConfigs: { [key: string]: ChartConfig } = {
  airTemperature: {
    airTemperature: { color: "hsl(var(--chart-1))" },
  },
  airHumidity: {
    airHumidity: { color: "hsl(var(--chart-2))" },
  },
  windSpeed: {
    windSpeed: { color: "hsl(var(--chart-3))" },
  },
  co2Concentration: {
    co2Concentration: { color: "hsl(var(--foreground))" },
  },
  soilMoisture: {
    soilMoisture: { color: "hsl(var(--chart-4))" },
  },
  nitrogen: {
    nitrogen: { color: "hsl(var(--chart-5))" },
  },
};
