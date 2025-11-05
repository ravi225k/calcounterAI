import {z} from 'zod';

export const AnalyzeFoodInputSchema = z.object({
  foodDescription: z
    .string()
    .describe('A detailed description of the food consumed, including ingredients and quantities.'),
});
export type AnalyzeFoodInput = z.infer<typeof AnalyzeFoodInputSchema>;

export const AnalyzeFoodOutputSchema = z.object({
  foodDescription: z.string().describe('A short, one-sentence description of the food identified in the image or text.'),
  totalCalories: z.number().describe('The estimated total calories of the food.'),
  macros: z.object({
    carbs: z.number().describe('The estimated grams of carbohydrates in the food.'),
    fats: z.number().describe('The estimated grams of fats in the food.'),
    protein: z.number().describe('The estimated grams of protein in the food.'),
  }).describe('The macro nutrient breakdown of the food.'),
});
export type AnalyzeFoodOutput = z.infer<typeof AnalyzeFoodOutputSchema>;


export const AnalyzeFoodFromImageInputSchema = z.object({
    foodImage: z
        .string()
        .describe(
        "A photo of the food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
});
export type AnalyzeFoodFromImageInput = z.infer<typeof AnalyzeFoodFromImageInputSchema>;


export const AnalyzeDietaryIntakeInputSchema = z.object({
  meals: z.string().describe('A list of meals logged by the user, with descriptions of the foods consumed.'),
  dailyCalorieTarget: z.number().describe('The user\'s daily calorie target.'),
  fitnessGoal: z.string().describe('The user\'s fitness goal (e.g., lose weight, maintain weight, gain muscle).'),
});
export type AnalyzeDietaryIntakeInput = z.infer<typeof AnalyzeDietaryIntakeInputSchema>;

export const AnalyzeDietaryIntakeOutputSchema = z.object({
  positiveFeedback: z.string().describe('What the user ate well today.'),
  areasForImprovement: z.string().describe('Suggestions for what the user could improve in their diet.'),
});
export type AnalyzeDietaryIntakeOutput = z.infer<typeof AnalyzeDietaryIntakeOutputSchema>;
