'use server';

/**
 * @fileOverview Analyzes food descriptions using AI to estimate calorie and macro content.
 *
 * - analyzeFood - Analyzes the food and returns the estimated calorie and macro content.
 * - AnalyzeFoodInput - The input type for the analyzeFood function.
 * - AnalyzeFoodOutput - The return type for the analyzeFood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeFoodInputSchema = z.object({
  foodDescription: z
    .string()
    .describe('A detailed description of the food consumed, including ingredients and quantities.'),
});
export type AnalyzeFoodInput = z.infer<typeof AnalyzeFoodInputSchema>;

const AnalyzeFoodOutputSchema = z.object({
  totalCalories: z.number().describe('The estimated total calories of the food.'),
  macros: z.object({
    carbs: z.number().describe('The estimated grams of carbohydrates in the food.'),
    fats: z.number().describe('The estimated grams of fats in the food.'),
    protein: z.number().describe('The estimated grams of protein in the food.'),
  }).describe('The macro nutrient breakdown of the food.'),
});
export type AnalyzeFoodOutput = z.infer<typeof AnalyzeFoodOutputSchema>;

export async function analyzeFood(input: AnalyzeFoodInput): Promise<AnalyzeFoodOutput> {
  return analyzeFoodFlow(input);
}

const analyzeFoodPrompt = ai.definePrompt({
  name: 'analyzeFoodPrompt',
  input: {schema: AnalyzeFoodInputSchema},
  output: {schema: AnalyzeFoodOutputSchema},
  system: `You are an expert nutritionist. Your primary function is to determine the nutritional content of a food item based on a user's description. You must be as accurate as possible. For branded food products, you MUST use your knowledge to look up the exact nutritional information from the manufacturer. For generic foods, use the most reliable data available. Do not estimate unless absolutely necessary, and if you must estimate, you must state that the result is an estimate.`,
  prompt: `Analyze the following food description and provide its precise nutritional content.

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
