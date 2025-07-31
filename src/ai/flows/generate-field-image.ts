'use server';

/**
 * @fileOverview Um fluxo para gerar imagens de campos agrícolas usando IA.
 *
 * - generateFieldImage - Gera uma imagem com base em uma descrição de texto.
 * - GenerateFieldImageInput - O tipo de entrada para a função.
 * - GenerateFieldImageOutput - O tipo de retorno para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFieldImageInputSchema = z.string();
export type GenerateFieldImageInput = z.infer<
  typeof GenerateFieldImageInputSchema
>;

const GenerateFieldImageOutputSchema = z.object({
  imageUrl: z.string().describe('A URL da imagem gerada como um data URI.'),
});
export type GenerateFieldImageOutput = z.infer<
  typeof GenerateFieldImageOutputSchema
>;

export async function generateFieldImage(
  prompt: GenerateFieldImageInput
): Promise<GenerateFieldImageOutput> {
  return generateFieldImageFlow(prompt);
}

const generateFieldImageFlow = ai.defineFlow(
  {
    name: 'generateFieldImageFlow',
    inputSchema: GenerateFieldImageInputSchema,
    outputSchema: GenerateFieldImageOutputSchema,
  },
  async (prompt) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Gere uma imagem de satélite de um campo agrícola. Condições: ${prompt}. Estilo: realista, vista de cima.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error("A API não retornou uma URL de imagem.");
    }
    
    return { imageUrl: media.url };
  }
);
