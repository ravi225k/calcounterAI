'use server';
/**
 * @fileOverview Provides personalized dietary feedback and suggestions based on the user's logged meals.
 *
 * - analyzeDietaryIntake - A function that analyzes the user's dietary intake and provides feedback.
 */

import {ai} from '@/ai/genkit';
import {AnalyzeDietaryIntakeInputSchema, AnalyzeDietaryIntakeOutputSchema, type AnalyzeDietaryIntakeInput, type AnalyzeDietaryIntakeOutput} from '@/ai/schemas';


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
