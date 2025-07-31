'use server';

/**
 * @fileOverview A flow to synchronize tasks with Google Tasks.
 * 
 * - syncWithGoogleTasks - A function that handles syncing tasks to a user's Google Tasks account.
 * - SyncWithGoogleTasksInput - The input type for the syncWithGoogleTasks function.
 * - SyncWithGoogleTasksOutput - The return type for the syncWithGoogleTasks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { syncToGoogleTasks } from '@/services/google-api';

export const SyncWithGoogleTasksInputSchema = z.object({
  accessToken: z.string().describe('The OAuth access token for the user.'),
  tasks: z.array(
    z.object({
        task: z.string(),
        category: z.string(),
        priority: z.number(),
        completed: z.boolean(),
    })
  ).describe('The list of tasks to sync.'),
});
export type SyncWithGoogleTasksInput = z.infer<typeof SyncWithGoogleTasksInputSchema>;

export const SyncWithGoogleTasksOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  tasklistLink: z.string().optional(),
});
export type SyncWithGoogleTasksOutput = z.infer<typeof SyncWithGoogleTasksOutputSchema>;

export async function syncWithGoogleTasks(input: SyncWithGoogleTasksInput): Promise<SyncWithGoogleTasksOutput> {
  return syncWithGoogleTasksFlow(input);
}


const syncWithGoogleTasksFlow = ai.defineFlow(
  {
    name: 'syncWithGoogleTasksFlow',
    inputSchema: SyncWithGoogleTasksInputSchema,
    outputSchema: SyncWithGoogleTasksOutputSchema,
    auth: (input) => {
        if (!input.accessToken) {
            throw new Error('Authentication required.');
        }
    }
  },
  async (input) => {
    try {
        const result = await syncToGoogleTasks(input.accessToken, input.tasks);
        return result;
    } catch(e: any) {
        console.error('Error in syncWithGoogleTasksFlow:', e);
        return {
            success: false,
            message: e.message || 'An unknown error occurred while syncing to Google Tasks.'
        }
    }
  }
);
