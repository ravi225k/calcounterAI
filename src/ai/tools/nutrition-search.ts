'use server';
/**
 * @fileOverview Defines a Genkit tool for searching for nutritional information.
 *
 * - nutritionSearch - A tool that uses Google Search to find nutritional facts.
 */

import {ai} from '@/ai/genkit';
import {search} from '@genkit-ai/google-search';
import {z} from 'zod';

export const nutritionSearch = ai.defineTool(
  {
    name: 'nutritionSearch',
    description:
      'Search for nutritional information for a given food. Use this to find calorie and macronutrient data for branded products or general food items.',
    inputSchema: z.object({
      query: z
        .string()
        .describe('The food item to search for, e.g., "Alpino superoats chocolate flavour"'),
    }),
    outputSchema: z.any(),
  },
  async (input: {query: string}) => {
    return await search(input.query);
  }
);
