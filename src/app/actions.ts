'use server';

import {
  generateAnomalyAlerts as genkitGenerateAnomalyAlerts,
  type AnomalyAlertsInput,
  type AnomalyAlertsOutput,
} from '@/ai/flows/generate-anomaly-alerts';

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
