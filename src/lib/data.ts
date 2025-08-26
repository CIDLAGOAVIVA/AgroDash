import type { Crop, HistoryData } from "@/types";



import type { DashboardCrop, HistoryData, Property, Station, Sensor, Quantity, AlertCriterion } from "@/types";

import type { ChartConfig } from "@/components/ui/chart"
import { MapPin, Compass, Landmark, Navigation, Map } from "lucide-react";

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

export const initialCrops: DashboardCrop[] = [
  // Culturas para Propriedade 1
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
    location: { lat: -23.5505, lng: -46.6333 },
    imageUrl: "/images/soy-field.jpg",
    sensorThresholds: {
      airTemperature: { min: 20, max: 30 },
      airHumidity: { min: 60, max: 85 },
      soilMoisture: { min: 55, max: 75 }
    }
  },
  {
    id: "corn-1",
    cropType: "Milho",
    fieldName: "Campo Central",
    airTemperature: baseHistoryCorn.airTemp,
    airHumidity: baseHistoryCorn.airHumidity,
    windSpeed: baseHistoryCorn.windSpeed,
    windDirection: "SW",
    co2Concentration: baseHistoryCorn.co2Concentration,
    soilMoisture: baseHistoryCorn.soilMoisture,
    nitrogen: baseHistoryCorn.nitrogen,
    history: generateInitialHistory(baseHistoryCorn),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "A umidade do solo está ligeiramente abaixo do ideal para a floração. Monitore a irrigação.", severity: "Atenção" },
      { dateTime: getPastDateTime(180), message: "Velocidade do vento aumentou, sem risco imediato.", severity: "Normal" },
      { dateTime: getPastDateTime(300), message: "Níveis de Nitrogênio estáveis.", severity: "Normal" },
    ],
    location: { lat: -23.5605, lng: -46.6433 },
    imageUrl: "/images/corn-field.jpg",
    sensorThresholds: {
      airTemperature: { min: 22, max: 32 },
      airHumidity: { min: 65, max: 80 },
      soilMoisture: { min: 50, max: 70 }
    }
  },
  {
    id: "wheat-1",
    cropType: "Trigo",
    fieldName: "Campo Sul",
    airTemperature: baseHistoryWheat.airTemp,
    airHumidity: baseHistoryWheat.airHumidity,
    windSpeed: baseHistoryWheat.windSpeed,
    windDirection: "SE",
    co2Concentration: baseHistoryWheat.co2Concentration,
    soilMoisture: baseHistoryWheat.soilMoisture,
    nitrogen: baseHistoryWheat.nitrogen,
    history: generateInitialHistory(baseHistoryWheat),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Risco de doença fúngica detectado devido à alta umidade e temperatura. Ação preventiva recomendada.", severity: "Crítico" },
      { dateTime: getPastDateTime(120), message: "Umidade do ar persistentemente alta.", severity: "Atenção" },
      { dateTime: getPastDateTime(240), message: "Condições ideais para o desenvolvimento vegetativo.", severity: "Normal" },
    ],
    location: { lat: -23.5705, lng: -46.6533 },
    imageUrl: "/images/wheat-field.jpg",
    sensorThresholds: {
      airTemperature: { min: 18, max: 26 },
      airHumidity: { min: 70, max: 90 },
      soilMoisture: { min: 60, max: 80 }
    }
  },
  // ... outras culturas que já existiam para Propriedade 2
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


export const initialProperties: Property[] = [
  {
    id: "prop-1",
    name: "Propriedade 1",
    crops: [
      initialCrops[0], // Soja - Campo Norte 7
      initialCrops[1], // Milho - Campo Central
      initialCrops[2], // Trigo - Campo Sul
    ],
  },
  {
    id: "prop-2",
    name: "Propriedade 2",
    crops: [
      // Usando as mesmas culturas da Propriedade 1 mas com IDs diferentes
      {
        ...initialCrops[0],
        id: "soy-2",
        fieldName: "Campo Leste 3",
        location: { lat: -23.5805, lng: -46.6133 }
      },
      {
        ...initialCrops[1],
        id: "corn-2",
        fieldName: "Campo Norte 5",
        location: { lat: -23.5905, lng: -46.6233 }
      },
      {
        ...initialCrops[2],
        id: "wheat-2",
        fieldName: "Campo Oeste",
        location: { lat: -23.6005, lng: -46.6333 }
      }
    ],
  },
];

export const initialStations: Station[] = [
  { id: 'station-1', id_propriedade: 'prop-1', nome_estacao: 'Estação Central', descricao_estacao: 'Localizada no pátio principal' },
  { id: 'station-2', id_propriedade: 'prop-1', nome_estacao: 'Estação Norte', descricao_estacao: 'Perto do Campo Norte 7' },
  { id: 'station-3', id_propriedade: 'prop-1', nome_estacao: 'Estação Sul', descricao_estacao: 'Próxima ao Campo Sul' },
  // Estações para a Propriedade 2
  { id: 'station-4', id_propriedade: 'prop-2', nome_estacao: 'Estação Principal', descricao_estacao: 'Estação central da Propriedade 2' },
  { id: 'station-5', id_propriedade: 'prop-2', nome_estacao: 'Estação Leste', descricao_estacao: 'Monitora os campos da região leste' },
  { id: 'station-6', id_propriedade: 'prop-2', nome_estacao: 'Estação Oeste', descricao_estacao: 'Monitora os campos da região oeste' },
];

export const initialSensors: Sensor[] = [
  { id: 'sensor-1', id_estacao: 'station-1', nome_sensor: 'DHT22-1', descricao_sensor: 'Temperatura e Umidade do Ar' },
  { id: 'sensor-2', id_estacao: 'station-2', nome_sensor: 'Anemômetro-1', descricao_sensor: 'Velocidade e direção do vento' },
  { id: 'sensor-3', id_estacao: 'station-2', nome_sensor: 'SCD-30', descricao_sensor: 'Concentração de CO2' },
  // Sensores para a Propriedade 2
  { id: 'sensor-4', id_estacao: 'station-4', nome_sensor: 'DHT22-2', descricao_sensor: 'Temperatura e Umidade do Ar' },
  { id: 'sensor-5', id_estacao: 'station-5', nome_sensor: 'Anemômetro-2', descricao_sensor: 'Velocidade e direção do vento' },
  { id: 'sensor-6', id_estacao: 'station-6', nome_sensor: 'SoilSense-1', descricao_sensor: 'Umidade e Nutrientes do Solo' },
];

export const initialQuantities: Quantity[] = [
  { id: 'qty-1', nome_grandeza: 'Temperatura do Ar', unidade_medida: '°C', descricao_grandeza: 'Mede a temperatura do ambiente' },
  { id: 'qty-2', nome_grandeza: 'Umidade do Solo', unidade_medida: '%', descricao_grandeza: 'Mede a umidade do solo' },
  { id: 'qty-3', nome_grandeza: 'Nível de Nitrogênio', unidade_medida: 'ppm', descricao_grandeza: 'Concentração de Nitrogênio no solo' },
];

export const initialAlertCriteria: AlertCriterion[] = [
  { id: 'crit-1', id_sensor: 'sensor-1', id_grandeza: 'qty-1', comparacao: '>', valor_critico_1: 35, alerta: 'Temperatura muito alta, risco de estresse térmico para a soja.', repeticao_seg: 600, ativo: true },
  { id: 'crit-2', id_sensor: 'sensor-3', id_grandeza: 'qty-2', comparacao: '<', valor_critico_1: 20, alerta: 'Umidade do solo criticamente baixa, irrigação necessária.', repeticao_seg: 300, ativo: true },
  // Critérios para a Propriedade 2
  { id: 'crit-3', id_sensor: 'sensor-4', id_grandeza: 'qty-1', comparacao: '>', valor_critico_1: 32, alerta: 'Temperatura elevada na Propriedade 2, verificar irrigação.', repeticao_seg: 600, ativo: true },
  { id: 'crit-4', id_sensor: 'sensor-6', id_grandeza: 'qty-3', comparacao: '<', valor_critico_1: 150, alerta: 'Níveis de nitrogênio baixos, considerar fertilização.', repeticao_seg: 1200, ativo: true },
];

export const stationIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Central": MapPin,
  "Norte": Compass,
  "Sul": Landmark,
  "Leste": Navigation,
  "Oeste": Map,
};

export const dashboardStations: DashboardStation[] = [
  {
    id: "station-1",
    name: "Estação Central",
    description: "Estação principal no centro da propriedade",
    location: { lat: -23.5505, lng: -46.6333 },
    sensors: {
      airTemperature: 28.5,
      airHumidity: 65,
      windSpeed: 12,
      windDirection: "NE",
      co2Concentration: 410,
      soilMoisture: 45,
      nitrogen: 220,
    },
    history: generateInitialHistory(baseHistorySoy),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Nível de umidade do soil está abaixo do recomendado para esta fase da cultura.", severity: "Atenção" },
      { dateTime: getPastDateTime(60), message: "Todos os sensores operando normalmente.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 70 }
    }
  },
  {
    id: "station-2",
    name: "Estação Norte",
    description: "Estação localizada na região norte da propriedade",
    location: { lat: -23.5405, lng: -46.6233 },
    sensors: {
      airTemperature: 27.2,
      airHumidity: 68,
      windSpeed: 14,
      windDirection: "N",
      co2Concentration: 405,
      soilMoisture: 52,
      nitrogen: 190,
    },
    history: generateInitialHistory({ ...baseHistorySoy, airTemp: 27.2, airHumidity: 68, windSpeed: 14, soilMoisture: 52, nitrogen: 190 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Velocidade do vento acima do normal, monitorar possíveis danos às culturas.", severity: "Atenção" },
      { dateTime: getPastDateTime(120), message: "Todos os parâmetros normais.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      windSpeed: { min: undefined, max: 15 },
      soilMoisture: { min: 40, max: 70 }
    }
  },
  {
    id: "station-3",
    name: "Estação Sul",
    description: "Estação localizada próximo ao Campo Sul",
    location: { lat: -23.5605, lng: -46.6433 },
    sensors: {
      airTemperature: 23.8,
      airHumidity: 78,
      windSpeed: 8,
      windDirection: "SE",
      co2Concentration: 415,
      soilMoisture: 58,
      nitrogen: 210,
    },
    history: generateInitialHistory({ ...baseHistoryWheat, airTemp: 23.8, airHumidity: 78, windSpeed: 8, soilMoisture: 58, nitrogen: 210 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Umidade do ar elevada, monitorar para prevenir doenças fúngicas.", severity: "Atenção" },
      { dateTime: getPastDateTime(180), message: "Sensor de temperatura recalibrado.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 18, max: 28 },
      airHumidity: { min: 65, max: 85 },
      soilMoisture: { min: 45, max: 75 }
    }
  },
  {
    id: "station-4",
    name: "Estação Leste",
    description: "Estação na divisa leste da propriedade",
    location: { lat: -23.5485, lng: -46.6203 },
    sensors: {
      airTemperature: 26.1,
      airHumidity: 63,
      windSpeed: 10,
      windDirection: "L",
      co2Concentration: 400,
      soilMoisture: 42,
      nitrogen: 175,
    },
    history: generateInitialHistory({ ...baseHistorySoy, airTemp: 26.1, airHumidity: 63, windSpeed: 10, soilMoisture: 42, nitrogen: 175 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Umidade do solo abaixo do recomendado, irrigação necessária.", severity: "Crítico" },
      { dateTime: getPastDateTime(30), message: "Níveis de nitrogênio adequados.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      soilMoisture: { min: 45, max: 70 },
      nitrogen: { min: 150, max: undefined }
    }
  },
  {
    id: "station-5",
    name: "Estação Oeste",
    description: "Estação no extremo oeste da fazenda",
    location: { lat: -23.5535, lng: -46.6443 },
    sensors: {
      airTemperature: 25.4,
      airHumidity: 70,
      windSpeed: 11,
      windDirection: "SO",
      co2Concentration: 420,
      soilMoisture: 48,
      nitrogen: 200,
    },
    history: generateInitialHistory({ ...baseHistoryCorn, airTemp: 25.4, airHumidity: 70, windSpeed: 11, soilMoisture: 48, nitrogen: 200 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Concentração de CO2 ligeiramente elevada.", severity: "Normal" },
      { dateTime: getPastDateTime(90), message: "Manutenção preventiva realizada em todos os sensores.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      co2Concentration: { min: undefined, max: 450 },
      soilMoisture: { min: 40, max: 70 }
    }
  },
  {
    id: "station-6",
    name: "Estação Principal P2",
    description: "Estação principal da Propriedade 2",
    location: { lat: -23.5805, lng: -46.6133 },
    sensors: {
      airTemperature: 26.8,
      airHumidity: 68,
      windSpeed: 10,
      windDirection: "SE",
      co2Concentration: 405,
      soilMoisture: 50,
      nitrogen: 185,
    },
    history: generateInitialHistory({ ...baseHistorySoy, airTemp: 26.8, airHumidity: 68, windSpeed: 10, soilMoisture: 50, nitrogen: 185 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Todos os sensores operando normalmente.", severity: "Normal" },
      { dateTime: getPastDateTime(60), message: "Manutenção preventiva agendada.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 70 }
    }
  },
  {
    id: "station-7",
    name: "Estação Leste P2",
    description: "Estação leste da Propriedade 2",
    location: { lat: -23.5905, lng: -46.6233 },
    sensors: {
      airTemperature: 25.2,
      airHumidity: 72,
      windSpeed: 8,
      windDirection: "L",
      co2Concentration: 410,
      soilMoisture: 55,
      nitrogen: 200,
    },
    history: generateInitialHistory({ ...baseHistoryCorn, airTemp: 25.2, airHumidity: 72, windSpeed: 8, soilMoisture: 55, nitrogen: 200 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Umidade do solo adequada para as culturas.", severity: "Normal" },
      { dateTime: getPastDateTime(120), message: "Temperatura estável nas últimas 24h.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 70 }
    }
  },
  {
    id: "station-8",
    name: "Estação Oeste P2",
    description: "Estação oeste da Propriedade 2",
    location: { lat: -23.6005, lng: -46.6333 },
    sensors: {
      airTemperature: 27.5,
      airHumidity: 65,
      windSpeed: 12,
      windDirection: "O",
      co2Concentration: 400,
      soilMoisture: 48,
      nitrogen: 190,
    },
    history: generateInitialHistory({ ...baseHistoryWheat, airTemp: 27.5, airHumidity: 65, windSpeed: 12, soilMoisture: 48, nitrogen: 190 }),
    alertHistory: [
      { dateTime: getCurrentDateTime(), message: "Velocidade do vento acima do normal, monitorando.", severity: "Atenção" },
      { dateTime: getPastDateTime(90), message: "Níveis de CO2 estáveis.", severity: "Normal" },
    ],
    sensorThresholds: {
      airTemperature: { min: 20, max: 32 },
      airHumidity: { min: 60, max: 80 },
      windSpeed: { min: undefined, max: 15 },
      soilMoisture: { min: 40, max: 70 }
    }
  }
];
