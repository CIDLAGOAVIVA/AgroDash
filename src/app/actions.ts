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
    const result = await genkitGenerateAnomalyAlerts(input);
    return result;
  } catch (error) {
    console.error('Error generating anomaly alert:', error);
    return {alertMessage: 'Não foi possível obter recomendação da IA.', alertSeverity: 'Atenção'};
  }
}

export async function generateFieldImage(
  prompt: GenerateFieldImageInput
): Promise<GenerateFieldImageOutput> {
  try {
    const result = await genkitGenerateFieldImage(prompt);
    return result;
  } catch (error) {
    console.error('Error generating field image:', error);
    // Return a placeholder or a specific error indicator
    return { imageUrl: "https://placehold.co/512x512/ff0000/FFFFFF?text=Error" };
  }
}
