'use server';

/**
 * @fileOverview Analyzes food images using AI to estimate calorie and macro content.
 *
 * - analyzeFoodFromImage - Analyzes the food image and returns the estimated calorie and macro content.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeFoodFromImageInputSchema, AnalyzeFoodOutputSchema, type AnalyzeFoodFromImageInput, type AnalyzeFoodOutput } from '@/ai/schemas';

export async function analyzeFoodFromImage(input: AnalyzeFoodFromImageInput): Promise<AnalyzeFoodOutput> {
  return analyzeFoodFromImageFlow(input);
}

const analyzeFoodFromImagePrompt = ai.definePrompt({
  name: 'analyzeFoodFromImagePrompt',
  input: {schema: AnalyzeFoodFromImageInputSchema},
  output: {schema: AnalyzeFoodOutputSchema},
  system: `You are an expert nutritionist. Your primary function is to determine the nutritional content of a food item based on an image. You must be as accurate as possible. For branded food products, you MUST use your knowledge to look up the exact nutritional information from the manufacturer. For generic foods, use the most reliable data available. Do not estimate unless absolutely necessary, and if you must estimate, you must state that the result is an estimate.`,
  prompt: `Analyze the following food image and provide its precise nutritional content and a short description of the food.

Photo: {{media url=foodImage}}`,
});

const analyzeFoodFromImageFlow = ai.defineFlow(
  {
    name: 'analyzeFoodFromImageFlow',
    inputSchema: AnalyzeFoodFromImageInputSchema,
    outputSchema: AnalyzeFoodOutputSchema,
  },
  async input => {
    const {output} = await analyzeFoodFromImagePrompt(input);
    return output!;
  }
);
