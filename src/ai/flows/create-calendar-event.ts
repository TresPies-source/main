
'use server';

/**
 * @fileOverview A flow to create a Google Calendar event from a task.
 * 
 * - createCalendarEvent - A function that handles creating a Google Calendar event.
 * - CreateCalendarEventInput - The input type for the createCalendarEvent function.
 * - CreateCalendarEventOutput - The return type for the createCalendarEvent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createGoogleCalendarEvent } from '@/services/google-api';

const TaskSchema = z.object({
    id: z.string(),
    task: z.string(),
    category: z.string(),
    priority: z.number(),
    completed: z.boolean(),
    createdAt: z.number(),
});

const CreateCalendarEventInputSchema = z.object({
  accessToken: z.string().describe('The OAuth access token for the user.'),
  task: TaskSchema.describe('The task to create an event for.'),
});
export type CreateCalendarEventInput = z.infer<typeof CreateCalendarEventInputSchema>;

const CreateCalendarEventOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  eventLink: z.string().optional(),
});
export type CreateCalendarEventOutput = z.infer<typeof CreateCalendarEventOutputSchema>;

export async function createCalendarEvent(input: CreateCalendarEventInput): Promise<CreateCalendarEventOutput> {
  return createCalendarEventFlow(input);
}


const createCalendarEventFlow = ai.defineFlow(
  {
    name: 'createCalendarEventFlow',
    inputSchema: CreateCalendarEventInputSchema,
    outputSchema: CreateCalendarEventOutputSchema,
    auth: (input) => {
        if (!input.accessToken) {
            throw new Error('Authentication required.');
        }
    }
  },
  async (input) => {
    try {
        const result = await createGoogleCalendarEvent(input.accessToken, input.task);
        return result;
    } catch(e: any) {
        console.error('Error in createCalendarEventFlow:', e);
        return {
            success: false,
            message: e.message || 'An unknown error occurred while creating the calendar event.'
        }
    }
  }
);
