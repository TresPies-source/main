
'use server';

/**
 * @fileOverview AI flow that generates a supportive and encouraging response to a user's stated daily intentions, with awareness of past intentions.
 *
 * - generateEncouragingResponse - A function that generates an encouraging response to user intentions.
 * - GenerateEncouragingResponseInput - The input type for the generateEncouragingResponse function.
 * - GenerateEncouragingResponseOutput - The return type for the generateEncouragingResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEncouragingResponseInputSchema = z.object({
  intention: z.string().describe("The user's stated daily intention or goal."),
  previousIntentions: z.array(z.string()).optional().describe("A list of the user's recent past intentions to provide context."),
});
export type GenerateEncouragingResponseInput = z.infer<typeof GenerateEncouragingResponseInputSchema>;

const GenerateEncouragingResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated supportive and encouraging response.'),
});
export type GenerateEncouragingResponseOutput = z.infer<typeof GenerateEncouragingResponseOutputSchema>;

export async function generateEncouragingResponse(input: GenerateEncouragingResponseInput): Promise<GenerateEncouragingResponseOutput> {
  return generateEncouragingResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEncouragingResponsePrompt',
  input: {schema: GenerateEncouragingResponseInputSchema},
  output: {schema: GenerateEncouragingResponseOutputSchema},
  prompt: `You are a supportive and encouraging AI assistant designed to help users stay motivated and focused on their goals. When a user states their daily intention, generate a brief, uplifting response to encourage them.

{{#if previousIntentions}}
To give you some context, here are some of the user's recent intentions:
{{#each previousIntentions}}
- {{{this}}}
{{/each}}
Use this context to provide a more personalized and relevant response. For example, if you see a pattern, you could acknowledge their consistency.
{{/if}}

User's New Intention: {{{intention}}}

Encouraging Response:`, 
});

const generateEncouragingResponseFlow = ai.defineFlow(
  {
    name: 'generateEncouragingResponseFlow',
    inputSchema: GenerateEncouragingResponseInputSchema,
    outputSchema: GenerateEncouragingResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
