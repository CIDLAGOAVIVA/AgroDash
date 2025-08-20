

export interface HistoryData {
  time: string;
  airTemperature: number;
  airHumidity: number;
  windSpeed: number;
  windDirection: string;
  co2Concentration: number;
  soilMoisture: number;
  nitrogen: number;
}

export type AlertSeverity = 'Normal' | 'Atenção' | 'Crítico';

export interface AlertEntry {
  dateTime: string;
  message: string;
  severity: AlertSeverity;
}

export interface DashboardCrop {
  id: string;
  cropType: string;
  fieldName: string;
  airTemperature: number;
  airHumidity: number;
  windSpeed: number;
  windDirection: string;
  co2Concentration: number;
  soilMoisture: number;
  nitrogen: number;
  history: HistoryData[];
  alertHistory: AlertEntry[];
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
}

export interface Property {
  id: string;
  uf: string;
  municipio: string;
  nome_propriedade: string;
}

export interface AdminCrop {
  id: string;
  propertyId: string;
  cropType: string;
  fieldName: string;
}

export interface Station {
    id: string;
    id_propriedade: string;
    nome_estacao: string;
    descricao_estacao: string;
}

export interface Sensor {
    id: string;
    id_estacao: string;
    nome_sensor: string;
    descricao_sensor: string;
}

export interface Quantity {
    id: string;
    nome_grandeza: string;
    unidade_medida: string;
    descricao_grandeza: string;
}

export interface AlertCriterion {
    id: string;
    id_sensor: string;
    id_grandeza: string;
    comparacao: ' > ' | ' < ' | ' >= ' | ' <= ' | '==' | '!=' | 'entre';
    valor_critico_1: number;
    valor_critico_2?: number;
    alerta: string;
    repeticao_seg: number;
    ativo: boolean;
}
