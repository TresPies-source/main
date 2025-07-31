'use server';

/**
 * @fileOverview A flow to export user data to Google Drive.
 * 
 * - exportToDrive - A function that handles exporting all user data to a JSON file in Google Drive.
 * - ExportToDriveInput - The input type for the exportToDrive function.
 * - ExportToDriveOutput - The return type for the exportToDrive function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { exportDataToGoogleDrive } from '@/services/google-api';

const ExportToDriveInputSchema = z.object({
  accessToken: z.string().describe('The OAuth access token for the user.'),
  userData: z.any().describe('A JSON object containing all the user data to be exported.'),
});
type ExportToDriveInput = z.infer<typeof ExportToDriveInputSchema>;

const ExportToDriveOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  fileLink: z.string().optional(),
});
type ExportToDriveOutput = z.infer<typeof ExportToDriveOutputSchema>;

export async function exportToDrive(input: ExportToDriveInput): Promise<ExportToDriveOutput> {
  return exportToDriveFlow(input);
}

const exportToDriveFlow = ai.defineFlow(
  {
    name: 'exportToDriveFlow',
    inputSchema: ExportToDriveInputSchema,
    outputSchema: ExportToDriveOutputSchema,
    auth: (input) => {
        if (!input.accessToken) {
            throw new Error('Authentication required.');
        }
    }
  },
  async (input) => {
    try {
        const result = await exportDataToGoogleDrive(input.accessToken, input.userData);
        return result;
    } catch(e: any) {
        console.error('Error in exportToDriveFlow:', e);
        return {
            success: false,
            message: e.message || 'An unknown error occurred while exporting data to Google Drive.'
        }
    }
  }
);
