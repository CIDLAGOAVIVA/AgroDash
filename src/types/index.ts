export interface HistoryData {
  time: string;
  soilTemperature: number;
  airTemperature: number;
  soilMoisture: number;
  airHumidity: number;
  solarRadiation: number;
  vegetationIndex: number;
}

export interface Crop {
  id: string;
  cropType: string;
  fieldName: string;
  soilTemperature: number;
  airTemperature: number;
  airHumidity: number;
  soilMoisture: number;
  solarRadiation: number;
  plantDevelopmentStage: string;
  vegetationIndex: number;
  history: HistoryData[];
  alertMessage: string;
  alertSeverity: 'Normal' | 'Atenção' | 'Crítico';
}
