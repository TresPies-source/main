'use server';

/**
 * @fileOverview A task categorization and prioritization AI agent.
 *
 * - categorizeAndPrioritizeTasks - A function that handles the task categorization and prioritization process.
 * - CategorizeAndPrioritizeTasksInput - The input type for the categorizeAndPrioritizeTasks function.
 * - CategorizeAndPrioritizeTasksOutput - The return type for the categorizeAndPrioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeAndPrioritizeTasksInputSchema = z.object({
  tasks: z.string().describe('A list of tasks to categorize and prioritize, separated by commas or new lines.'),
});
export type CategorizeAndPrioritizeTasksInput = z.infer<typeof CategorizeAndPrioritizeTasksInputSchema>;

const CategorizeAndPrioritizeTasksOutputSchema = z.array(
  z.object({
    task: z.string().describe('The original task.'),
    category: z.string().describe('The category of the task (e.g., Work, Personal).'),
    priority: z.number().int().min(1).max(10).describe('The priority level of the task (1-10).'),
  })
);
export type CategorizeAndPrioritizeTasksOutput = z.infer<typeof CategorizeAndPrioritizeTasksOutputSchema>;

export async function categorizeAndPrioritizeTasks(input: CategorizeAndPrioritizeTasksInput): Promise<CategorizeAndPrioritizeTasksOutput> {
  return categorizeAndPrioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeAndPrioritizeTasksPrompt',
  input: {schema: CategorizeAndPrioritizeTasksInputSchema},
  output: {schema: CategorizeAndPrioritizeTasksOutputSchema},
  prompt: `You are a personal assistant AI that categorizes and prioritizes tasks.

You will receive a list of tasks, which may be separated by commas or new lines. For each task, you will determine the category (e.g., Work, Personal) and assign a priority level (1-10). Respond with a valid JSON array.

Tasks:
{{{tasks}}}`,
});

const categorizeAndPrioritizeTasksFlow = ai.defineFlow(
  {
    name: 'categorizeAndPrioritizeTasksFlow',
    inputSchema: CategorizeAndPrioritizeTasksInputSchema,
    outputSchema: CategorizeAndPrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
