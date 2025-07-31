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
  alertMessage: string;
  alertSeverity: 'Normal' | 'Atenção' | 'Crítico';
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
}

export type Period = '24h' | '7d' | '30d';
