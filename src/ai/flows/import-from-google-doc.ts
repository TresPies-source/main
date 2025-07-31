'use server';

/**
 * @fileOverview A flow to import text content from a Google Doc.
 * 
 * - importFromGoogleDoc - A function that handles importing content from a Google Doc.
 * - ImportFromGoogleDocInput - The input type for the importFromGoogleDoc function.
 * - ImportFromGoogleDocOutput - The return type for the importFromGoogleDoc function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getGoogleDocContent } from '@/services/google-api';

const ImportFromGoogleDocInputSchema = z.object({
  accessToken: z.string().describe('The OAuth access token for the user.'),
  documentId: z.string().describe('The ID of the Google Doc to import.'),
});
type ImportFromGoogleDocInput = z.infer<typeof ImportFromGoogleDocInputSchema>;

const ImportFromGoogleDocOutputSchema = z.object({
  success: z.boolean(),
  content: z.string().optional(),
  message: z.string(),
});
type ImportFromGoogleDocOutput = z.infer<typeof ImportFromGoogleDocOutputSchema>;

export async function importFromGoogleDoc(input: ImportFromGoogleDocInput): Promise<ImportFromGoogleDocOutput> {
  return importFromGoogleDocFlow(input);
}

const importFromGoogleDocFlow = ai.defineFlow(
  {
    name: 'importFromGoogleDocFlow',
    inputSchema: ImportFromGoogleDocInputSchema,
    outputSchema: ImportFromGoogleDocOutputSchema,
    auth: (input) => {
        if (!input.accessToken) {
            throw new Error('Authentication required.');
        }
    }
  },
  async (input) => {
    try {
        const result = await getGoogleDocContent(input.accessToken, input.documentId);
        return result;
    } catch(e: any) {
        console.error('Error in importFromGoogleDocFlow:', e);
        return {
            success: false,
            message: e.message || 'An unknown error occurred while importing from Google Docs.'
        }
    }
  }
);
