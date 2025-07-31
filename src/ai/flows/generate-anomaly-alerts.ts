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
  airTemperature: z.number().describe('A temperatura do ar em Celsius.'),
  airHumidity: z.number().describe('A umidade do ar (percentual).'),
  windSpeed: z.number().describe('A velocidade do vento em km/h.'),
  windDirection: z.string().describe('A direção do vento (por exemplo, Norte, Sul, NE).'),
  co2Concentration: z.number().describe('A concentração de CO2 em ppm.'),
});
export type AnomalyAlertsInput = z.infer<typeof AnomalyAlertsInputSchema>;

const AnomalyAlertsOutputSchema = z.object({
  alertMessage: z
    .string()
    .describe(
      'A mensagem de alerta de anomalia, se houver. Se tudo estiver normal, retorne uma mensagem tranquilizadora.'
    ),
  alertSeverity: z
    .enum(['Normal', 'Atenção', 'Crítico'])
    .describe(
      'A severidade do alerta. "Normal" se as condições estiverem ideais, "Atenção" para desvios leves e "Crítico" para problemas que exigem ação imediata.'
    ),
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
  prompt: `Você é um consultor agrícola especialista. Você analisa dados de culturas em tempo real para identificar potenciais problemas e gerar alertas com níveis de severidade.

  Considere os seguintes dados para {{cropType}} em {{fieldName}}:

  - Temperatura do Ar: {{airTemperature}} °C
  - Umidade do Ar: {{airHumidity}}%
  - Velocidade do Vento: {{windSpeed}} km/h
  - Direção do Vento: {{windDirection}}
  - Concentração de CO2: {{co2Concentration}} ppm

  Com base nestes dados, determine se existem anomalias ou problemas potenciais que requerem atenção.
  1.  **Avalie os dados:** Considere limiares razoáveis para cada ponto de dados com base no tipo de cultura. Por exemplo, ventos fortes podem causar danos físicos, e altas concentrações de CO2 podem afetar a fotossíntese.
  2.  **Determine a Severidade:**
      - Se tudo estiver dentro dos parâmetros ideais, defina 'alertSeverity' como "Normal" e escreva uma mensagem curta e tranquilizadora em 'alertMessage'.
      - Se houver um leve desvio que deve ser monitorado, defina 'alertSeverity' como "Atenção" e forneça uma recomendação clara.
      - Se houver um problema sério que exige ação imediata, defina 'alertSeverity' como "Crítico" e gere uma mensagem de alerta concisa e direta.
  3.  **Gere a Resposta:** Preencha 'alertMessage' e 'alertSeverity' de acordo com sua análise.
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
