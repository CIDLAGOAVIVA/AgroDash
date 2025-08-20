

import type { DashboardCrop, HistoryData, Property, Station, Sensor, Quantity, AlertCriterion } from "@/types";
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

export const initialCrops: DashboardCrop[] = [
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
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Soja"
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
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Milho"
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
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Trigo"
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


export const initialProperties: Property[] = [
    { id: 'prop-1', nome_propriedade: 'Fazenda Experimental', municipio: 'Campinas', uf: 'SP' },
    { id: 'prop-2', nome_propriedade: 'Sítio Belo Campo', municipio: 'Piracicaba', uf: 'SP' },
];

export const initialStations: Station[] = [
    { id: 'station-1', id_propriedade: 'prop-1', nome_estacao: 'Estação Central', descricao_estacao: 'Localizada no pátio principal' },
    { id: 'station-2', id_propriedade: 'prop-1', nome_estacao: 'Estação Norte', descricao_estacao: 'Perto do Campo Norte 7' },
    { id: 'station-3', id_propriedade: 'prop-2', nome_estacao: 'Estação Única', descricao_estacao: 'Cobre toda a área do sítio' },
];

export const initialSensors: Sensor[] = [
    { id: 'sensor-1', id_estacao: 'station-1', nome_sensor: 'DHT22-1', descricao_sensor: 'Temperatura e Umidade do Ar' },
    { id: 'sensor-2', id_estacao: 'station-2', nome_sensor: 'Anemômetro-1', descricao_sensor: 'Velocidade e direção do vento' },
    { id: 'sensor-3', id_estacao: 'station-2', nome_sensor: 'SCD-30', descricao_sensor: 'Concentração de CO2' },
];

export const initialQuantities: Quantity[] = [
    { id: 'qty-1', nome_grandeza: 'Temperatura do Ar', unidade_medida: '°C', descricao_grandeza: 'Mede a temperatura do ambiente' },
    { id: 'qty-2', nome_grandeza: 'Umidade do Solo', unidade_medida: '%', descricao_grandeza: 'Mede a umidade do solo' },
    { id: 'qty-3', nome_grandeza: 'Nível de Nitrogênio', unidade_medida: 'ppm', descricao_grandeza: 'Concentração de Nitrogênio no solo' },
];

export const initialAlertCriteria: AlertCriterion[] = [
    { id: 'crit-1', id_sensor: 'sensor-1', id_grandeza: 'qty-1', comparacao: '>', valor_critico_1: 35, alerta: 'Temperatura muito alta, risco de estresse térmico para a soja.', repeticao_seg: 600, ativo: true },
    { id: 'crit-2', id_sensor: 'sensor-3', id_grandeza: 'qty-2', comparacao: '<', valor_critico_1: 20, alerta: 'Umidade do solo criticamente baixa, irrigação necessária.', repeticao_seg: 300, ativo: true },
];
