'use server';

import { generateAnomalyAlerts as genkitGenerateAnomalyAlerts, type AnomalyAlertsInput } from '@/ai/flows/generate-anomaly-alerts';

export async function generateAnomalyAlerts(input: AnomalyAlertsInput): Promise<{ alertMessage: string }> {
  try {
    const result = await genkitGenerateAnomalyAlerts(input);
    return result;
  } catch (error) {
    console.error("Error generating anomaly alert:", error);
    return { alertMessage: '' };
  }
}
