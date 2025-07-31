import type { Crop, HistoryData } from "@/types";

export const DEVELOPMENT_STAGES = ["Muda", "Vegetativo", "Floração", "Maturidade"];

export const generateInitialHistory = (baseValues: { soilTemp: number; airTemp: number; soilMoisture: number; airHumidity: number; solarRadiation: number; vegetationIndex: number }): HistoryData[] => {
  const history: HistoryData[] = [];
  let { soilTemp, airTemp, soilMoisture, airHumidity, solarRadiation, vegetationIndex } = baseValues;
  for (let i = 29; i >= 0; i--) {
    const time = new Date(Date.now() - i * 24 * 60 * 60000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    soilTemp += (Math.random() - 0.5) * 0.4;
    airTemp += (Math.random() - 0.5) * 0.6;
    soilMoisture += (Math.random() - 0.5) * 1;
    airHumidity += (Math.random() - 0.5) * 1.5;
    solarRadiation += (Math.random() - 0.5) * 40;
    vegetationIndex += (Math.random() - 0.5) * 0.01;


    history.push({
      time,
      soilTemperature: parseFloat(soilTemp.toFixed(1)),
      airTemperature: parseFloat(airTemp.toFixed(1)),
      soilMoisture: parseFloat(soilMoisture.toFixed(1)),
      airHumidity: parseFloat(airHumidity.toFixed(1)),
      solarRadiation: Math.round(solarRadiation),
      vegetationIndex: parseFloat(vegetationIndex.toFixed(2)),
    });
  }
  return history;
};

export const initialCrops: Crop[] = [
  {
    id: "soy-1",
    cropType: "Soja",
    fieldName: "Campo Norte 7",
    soilTemperature: 22.5,
    airTemperature: 25.1,
    airHumidity: 75.2,
    soilMoisture: 65.3,
    solarRadiation: 850,
    plantDevelopmentStage: "Vegetativo",
    vegetationIndex: 0.78,
    history: generateInitialHistory({ soilTemp: 22.5, airTemp: 25.1, soilMoisture: 65.3, airHumidity: 75.2, solarRadiation: 850, vegetationIndex: 0.78 }),
    alertMessage: "Condições ideais para o desenvolvimento vegetativo. Nenhuma ação necessária.",
    alertSeverity: "Normal",
    location: { lat: -22.846146, lng: -42.571864 },
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Soja"
  },
  {
    id: "corn-1",
    cropType: "Milho",
    fieldName: "Lote Leste Cume",
    soilTemperature: 24.1,
    airTemperature: 26.8,
    airHumidity: 72.8,
    soilMoisture: 58.9,
    solarRadiation: 920,
    plantDevelopmentStage: "Floração",
    vegetationIndex: 0.85,
    history: generateInitialHistory({ soilTemp: 24.1, airTemp: 26.8, soilMoisture: 58.9, airHumidity: 72.8, solarRadiation: 920, vegetationIndex: 0.85 }),
    alertMessage: "A umidade do solo está ligeiramente abaixo do ideal para a floração. Monitore a irrigação.",
    alertSeverity: "Atenção",
    location: { lat: -22.85, lng: -42.565 },
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Milho"
  },
  {
    id: "wheat-1",
    cropType: "Trigo",
    fieldName: "Fundo do Vale",
    soilTemperature: 19.8,
    airTemperature: 22.4,
    airHumidity: 80.5,
    soilMoisture: 72.1,
    solarRadiation: 780,
    plantDevelopmentStage: "Muda",
    vegetationIndex: 0.65,
    history: generateInitialHistory({ soilTemp: 19.8, airTemp: 22.4, soilMoisture: 72.1, airHumidity: 80.5, solarRadiation: 780, vegetationIndex: 0.65 }),
    alertMessage: "Alta umidade do ar e temperatura moderada podem favorecer o surgimento de doenças fúngicas.",
    alertSeverity: "Crítico",
    location: { lat: -22.84, lng: -42.58 },
    imageUrl: "https://placehold.co/500x500/228B22/FFFFFF?text=Trigo"
  },
];
