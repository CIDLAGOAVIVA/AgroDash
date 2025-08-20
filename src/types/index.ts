

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

// Representa a tabela tab_propriedade
export interface Property {
  id: string; // BIGINT no DB, mas string em JS/TS é mais seguro
  uf: string;
  municipio: string;
  nome_propriedade: string;
  operacao_inicio?: string | Date; // TIMESTAMP
  operacao_fim?: string | Date | null; // TIMESTAMP
}

// Representa a tabela tab_cultura para o formulário de admin
export interface AdminCrop {
  id: string; // BIGINT
  propertyId: string; // Mapeado de id_propriedade (BIGINT)
  cropType: string; // Mapeado de produto (VARCHAR)
  fieldName: string; // Mapeado de nome_cultura (VARCHAR)
}

// Representa a tabela tab_estacao
export interface Station {
    id: string; // BIGINT
    id_propriedade: string; // BIGINT
    nome_estacao: string; // VARCHAR
    descricao_estacao?: string | null; // VARCHAR
    operacao_inicio?: string | Date; // TIMESTAMP
    operacao_fim?: string | Date | null; // TIMESTAMP
}

// Representa a tabela tab_sensor
export interface Sensor {
    id: string; // BIGINT
    id_estacao: string; // BIGINT
    nome_sensor: string; // VARCHAR
    descricao_sensor?: string | null; // VARCHAR
    operacao_inicio?: string | Date; // TIMESTAMP
    operacao_fim?: string | Date | null; // TIMESTAMP
}

// Representa a tabela tab_grandeza
export interface Quantity {
    id: string; // BIGINT
    nome_grandeza: string; // VARCHAR
    unidade_medida?: string | null; // VARCHAR
    descricao_grandeza?: string | null; // VARCHAR
}

// Representa a tabela tab_criterio_alerta
export interface AlertCriterion {
    id: string; // Chave primária SINTÉTICA no cliente: `id_sensor-id_grandeza`
    id_sensor: string; // BIGINT
    id_grandeza: string; // BIGINT
    comparacao: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'entre'; // VARCHAR
    valor_critico_1: number; // DOUBLE PRECISION
    valor_critico_2?: number | null; // DOUBLE PRECISION
    alerta: string; // TEXT
    repeticao_seg: number; // INTEGER
    ativo: boolean; // BOOLEAN
}
