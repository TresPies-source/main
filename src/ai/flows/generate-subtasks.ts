// This needs wav package to be installed

'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating subtasks for a given task.
 *
 * - generateSubtasks - A function that generates subtasks for a given task.
 * - GenerateSubtasksInput - The input type for the generateSubtasks function.
 * - GenerateSubtasksOutput - The return type for the generateSubtasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubtasksInputSchema = z.object({
  task: z.string().describe('The complex task to break down into subtasks.'),
});
export type GenerateSubtasksInput = z.infer<typeof GenerateSubtasksInputSchema>;

const GenerateSubtasksOutputSchema = z.object({
  subtasks: z.array(z.string()).describe('The subtasks generated for the given task.'),
});
export type GenerateSubtasksOutput = z.infer<typeof GenerateSubtasksOutputSchema>;

export async function generateSubtasks(input: GenerateSubtasksInput): Promise<GenerateSubtasksOutput> {
  return generateSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubtasksPrompt',
  input: {schema: GenerateSubtasksInputSchema},
  output: {schema: GenerateSubtasksOutputSchema},
  prompt: `You are a helpful AI assistant that generates subtasks for a given task.

  Task: {{{task}}}

  Generate a list of subtasks that will help the user break down the task into smaller, more manageable steps.
  The subtasks should be specific and actionable. Return the subtasks as a JSON array of strings.
  `,
});

const generateSubtasksFlow = ai.defineFlow(
  {
    name: 'generateSubtasksFlow',
    inputSchema: GenerateSubtasksInputSchema,
    outputSchema: GenerateSubtasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
