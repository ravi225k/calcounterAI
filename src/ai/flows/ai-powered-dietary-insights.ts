'use server';
/**
 * @fileOverview Provides personalized dietary feedback and suggestions based on the user's logged meals.
 *
 * - analyzeDietaryIntake - A function that analyzes the user's dietary intake and provides feedback.
 * - AnalyzeDietaryIntakeInput - The input type for the analyzeDietaryIntake function.
 * - AnalyzeDietaryIntakeOutput - The return type for the analyzeDietaryIntake function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDietaryIntakeInputSchema = z.object({
  meals: z.string().describe('A list of meals logged by the user, with descriptions of the foods consumed.'),
  dailyCalorieTarget: z.number().describe('The user\'s daily calorie target.'),
  fitnessGoal: z.string().describe('The user\'s fitness goal (e.g., lose weight, maintain weight, gain muscle).'),
});
export type AnalyzeDietaryIntakeInput = z.infer<typeof AnalyzeDietaryIntakeInputSchema>;

const AnalyzeDietaryIntakeOutputSchema = z.object({
  positiveFeedback: z.string().describe('What the user ate well today.'),
  areasForImprovement: z.string().describe('Suggestions for what the user could improve in their diet.'),
});
export type AnalyzeDietaryIntakeOutput = z.infer<typeof AnalyzeDietaryIntakeOutputSchema>;

export async function analyzeDietaryIntake(input: AnalyzeDietaryIntakeInput): Promise<AnalyzeDietaryIntakeOutput> {
  return analyzeDietaryIntakeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDietaryIntakePrompt',
  input: {schema: AnalyzeDietaryIntakeInputSchema},
  output: {schema: AnalyzeDietaryIntakeOutputSchema},
  prompt: `You are a personal nutrition coach. Analyze the user's logged meals and provide feedback and suggestions based on their daily calorie target and fitness goal.

  User's Daily Calorie Target: {{{dailyCalorieTarget}}}
  User's Fitness Goal: {{{fitnessGoal}}}
  Logged Meals: {{{meals}}}

  Provide positive feedback on what the user ate well today, and suggest areas for improvement in their diet.
`,
});

const analyzeDietaryIntakeFlow = ai.defineFlow(
  {
    name: 'analyzeDietaryIntakeFlow',
    inputSchema: AnalyzeDietaryIntakeInputSchema,
    outputSchema: AnalyzeDietaryIntakeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
