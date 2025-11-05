'use server';

/**
 * @fileOverview Analyzes food descriptions using AI to estimate calorie and macro content.
 *
 * - analyzeFood - Analyzes the food and returns the estimated calorie and macro content.
 * - AnalyzeFoodInput - The input type for the analyzeFood function.
 * - AnalyzeFoodOutput - The return type for the analyzeFood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  system: `You are a nutrition data retrieval AI. Your ONLY function is to look up and return the precise, manufacturer-provided nutritional information for branded food products. You MUST NOT estimate, calculate, or approximate values for branded items. Use your extensive knowledge base to find the exact data. If a food is not a specific brand, you may then act as an expert nutritionist to provide an accurate estimate.`,
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
