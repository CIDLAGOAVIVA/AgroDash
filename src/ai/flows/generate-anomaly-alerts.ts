'use server';

/**
 * @fileOverview Um fluxo para gerar alertas de anomalias para dados de culturas.
 *
 * - generateAnomalyAlerts - Uma função que gera alertas de anomalias com base nos dados da cultura.
 * - AnomalyAlertsInput - O tipo de entrada para a função generateAnomalyAlerts.
 * - AnomalyAlertsOutput - O tipo de retorno para a função generateAnomalyAlerts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnomalyAlertsInputSchema = z.object({
  cropType: z.string().describe('O tipo de cultura (por exemplo, soja, milho).'),
  fieldName: z.string().describe('O nome do campo.'),
  soilTemperature: z.number().describe('A temperatura do solo em Celsius.'),
  airTemperature: z.number().describe('A temperatura do ar em Celsius.'),
  soilMoisture: z.number().describe('O nível de umidade do solo (percentual).'),
  solarRadiation: z.number().describe('O nível de radiação solar (W/m^2).'),
  plantDevelopmentStage: z
    .string()
    .describe('O estágio de desenvolvimento atual da planta (por exemplo, muda, floração).'),
  vegetationIndex: z.number().describe('O índice de vegetação (por exemplo, NDVI).'),
});
export type AnomalyAlertsInput = z.infer<typeof AnomalyAlertsInputSchema>;

const AnomalyAlertsOutputSchema = z.object({
  alertMessage: z.string().describe('A mensagem de alerta de anomalia, se houver.'),
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
  prompt: `Você é um consultor agrícola especialista. Você analisa dados de culturas em tempo real para identificar possíveis problemas e gerar alertas.

  Considere os seguintes dados para {{cropType}} em {{fieldName}}:

  - Temperatura do Solo: {{soilTemperature}} °C
  - Temperatura do Ar: {{airTemperature}} °C
  - Umidade do Solo: {{soilMoisture}}%
  - Radiação Solar: {{solarRadiation}} W/m^2
  - Estágio de Desenvolvimento da Planta: {{plantDevelopmentStage}}
  - Índice de Vegetação: {{vegetationIndex}}

  Com base nestes dados, determine se existem anomalias ou problemas potenciais que requerem atenção. Considere limiares razoáveis para cada ponto de dados com base no tipo de cultura и no estágio de desenvolvimento. Se houver algum problema, gere uma mensagem de alerta concisa descrevendo o problema. Se tudo estiver normal, retorne uma string vazia.
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
