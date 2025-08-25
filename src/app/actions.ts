'use server';

import {
  generateAnomalyAlerts as genkitGenerateAnomalyAlerts,
  type AnomalyAlertsInput,
  type AnomalyAlertsOutput,
} from '@/ai/flows/generate-anomaly-alerts';
import {
  generateFieldImage as genkitGenerateFieldImage,
  type GenerateFieldImageInput,
  type GenerateFieldImageOutput,
} from '@/ai/flows/generate-field-image';

export async function generateAnomalyAlerts(
  input: AnomalyAlertsInput
): Promise<AnomalyAlertsOutput> {
  try {
    // Verificar os limiares antes de chamar a IA
    const anomalies = [];
    const sensorThresholds = input.sensorThresholds;

    if (sensorThresholds) {
      if (sensorThresholds.airTemperature) {
        const { min, max } = sensorThresholds.airTemperature;
        if ((min !== undefined && input.airTemperature < min) ||
          (max !== undefined && input.airTemperature > max)) {
          anomalies.push(`Temperatura do ar ${input.airTemperature}°C fora dos limites ideais (${min}-${max}°C)`);
        }
      }
      // Similarmente para outros sensores...
    }

    // Se já detectamos anomalias pelos limiares, podemos retornar diretamente
    if (anomalies.length > 0) {
      return {
        alertMessage: anomalies.join('. '),
        alertSeverity: 'Atenção'
      };
    }

    // Caso contrário, chamamos a IA
    const result = await genkitGenerateAnomalyAlerts(input);
    return result;
  } catch (error) {
    console.error('Error generating anomaly alert:', error);
    return { alertMessage: 'Não foi possível obter recomendação da IA.', alertSeverity: 'Atenção' };
  }
}

export async function generateFieldImage(
  prompt: GenerateFieldImageInput
): Promise<GenerateFieldImageOutput> {
  try {
    const result = await genkitGenerateFieldImage(prompt);
    if (!result.imageUrl) {
      throw new Error("A API não retornou uma URL de imagem.");
    }
    return result;
  } catch (error) {
    console.error('Error generating field image:', error);
    return { imageUrl: "https://placehold.co/512x512/ff0000/FFFFFF?text=Error" };
  }
}
