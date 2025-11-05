'use server';

/**
 * @fileOverview Analyzes food descriptions using AI to estimate calorie and macro content.
 *
 * - analyzeFood - Analyzes the food and returns the estimated calorie and macro content.
 */

import {ai} from '@/ai/genkit';
import {AnalyzeFoodInputSchema, AnalyzeFoodOutputSchema, type AnalyzeFoodInput, type AnalyzeFoodOutput } from '@/ai/schemas';


export async function analyzeFood(input: AnalyzeFoodInput): Promise<AnalyzeFoodOutput> {
  return analyzeFoodFlow(input);
}

const analyzeFoodPrompt = ai.definePrompt({
  name: 'analyzeFoodPrompt',
  input: {schema: AnalyzeFoodInputSchema},
  output: {schema: AnalyzeFoodOutputSchema},
  system: `You are an expert nutritionist. Your primary function is to determine the nutritional content of a food item based on a user's description. You must be as accurate as possible. For branded food products, you MUST use your knowledge to look up the exact nutritional information from the manufacturer. For generic foods, use the most reliable data available. Do not estimate unless absolutely necessary, and if you must estimate, you must state that the result is an estimate.`,
  prompt: `Analyze the following food description and provide its precise nutritional content and a short description of the food.

Food Description: {{{foodDescription}}}`,
});

const analyzeFoodFlow = ai.defineFlow(
  {
    name: 'analyzeFoodFlow',
    inputSchema: AnalyzeFoodInputSchema,
    outputSchema: AnalyzeFoodOutputSchema,
  },
  async input => {
    const {output} = await analyzeFoodPrompt(input);
    return output!;
  }
);
