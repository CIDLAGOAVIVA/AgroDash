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

export interface SensorThreshold {
  min?: number;
  max?: number;
}

export interface Crop {
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
  sensorThresholds?: {
    airTemperature?: SensorThreshold;
    airHumidity?: SensorThreshold;
    windSpeed?: SensorThreshold;
    co2Concentration?: SensorThreshold;
    soilMoisture?: SensorThreshold;
    nitrogen?: SensorThreshold;
  };
}
