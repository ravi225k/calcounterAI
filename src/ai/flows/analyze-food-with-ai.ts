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
  prompt: `Analyze the following food description and estimate its nutritional content. Provide the total calories, carbs, fats, and protein.

Food Description: {{{foodDescription}}}

Format your output as a JSON object with 'totalCalories' as a number, and 'macros' as a nested object containing 'carbs', 'fats', and 'protein', each as a number. Do NOT include units.

Example:
{
  "totalCalories": 350,
  "macros": {
    "carbs": 40,
    "fats": 15,
    "protein": 20
  }
}`,
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
