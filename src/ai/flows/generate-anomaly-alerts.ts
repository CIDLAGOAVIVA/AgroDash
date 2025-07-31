'use server';

/**
 * @fileOverview A flow for generating anomaly alerts for crop data.
 *
 * - generateAnomalyAlerts - A function that generates anomaly alerts based on crop data.
 * - AnomalyAlertsInput - The input type for the generateAnomalyAlerts function.
 * - AnomalyAlertsOutput - The return type for the generateAnomalyAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnomalyAlertsInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., soybeans, corn).'),
  fieldName: z.string().describe('The name of the field.'),
  soilTemperature: z.number().describe('The soil temperature in Celsius.'),
  airTemperature: z.number().describe('The air temperature in Celsius.'),
  soilMoisture: z.number().describe('The soil moisture level (percentage).'),
  solarRadiation: z.number().describe('The solar radiation level (W/m^2).'),
  plantDevelopmentStage: z
    .string()
    .describe('The current development stage of the plant (e.g., seedling, flowering).'),
  vegetationIndex: z.number().describe('The vegetation index (e.g., NDVI).'),
});
export type AnomalyAlertsInput = z.infer<typeof AnomalyAlertsInputSchema>;

const AnomalyAlertsOutputSchema = z.object({
  alertMessage: z.string().describe('The anomaly alert message, if any.'),
});
export type AnomalyAlertsOutput = z.infer<typeof AnomalyAlertsOutputSchema>;

export async function generateAnomalyAlerts(
  input: AnomalyAlertsInput
): Promise<AnomalyAlertsOutput> {
  return generateAnomalyAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anomalyAlertsPrompt',
  input: {schema: AnomalyAlertsInputSchema},
  output: {schema: AnomalyAlertsOutputSchema},
  prompt: `You are an expert agricultural advisor. You analyze real-time crop data to identify potential issues and generate alerts.

  Consider the following data for {{cropType}} in {{fieldName}}:

  - Soil Temperature: {{soilTemperature}} °C
  - Air Temperature: {{airTemperature}} °C
  - Soil Moisture: {{soilMoisture}}%
  - Solar Radiation: {{solarRadiation}} W/m^2
  - Plant Development Stage: {{plantDevelopmentStage}}
  - Vegetation Index: {{vegetationIndex}}

  Based on this data, determine if there are any anomalies or potential problems that require attention. Consider reasonable thresholds for each data point based on the crop type and development stage. If there are any issues, generate a concise alert message describing the problem. If everything is normal, return an empty string.
  `,
});

const generateAnomalyAlertsFlow = ai.defineFlow(
  {
    name: 'generateAnomalyAlertsFlow',
    inputSchema: AnomalyAlertsInputSchema,
    outputSchema: AnomalyAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
