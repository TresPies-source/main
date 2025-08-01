// src/pages/api/slack.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { handleSlackCommand, HandleSlackCommandOutput } from '@/ai/flows/handle-slack-command';

// This is a requirement for Cloud Functions and other server-side environments.
export const config = {
  maxInstances: 10,
  region: 'us-central1'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<HandleSlackCommandOutput | { error: string }>) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // In a production app, you would also verify the Slack signing secret here
    // to ensure requests are genuinely from Slack.
    // https://api.slack.com/authentication/verifying-requests-from-slack
    if (process.env.NODE_ENV === 'production' && !process.env.SLACK_SIGNING_SECRET) {
        console.error("SLACK_SIGNING_SECRET is not set. This is required in production.");
        return res.status(500).json({ error: 'Server configuration error.' });
    }


    try {
        // Next.js automatically parses urlencoded bodies.
        const { command, text, user_id, user_name } = req.body;

        if (!command || !text || !user_id || !user_name) {
            return res.status(400).json({ error: 'Missing required Slack fields.' });
        }
        
        // Call the Genkit flow to handle the command logic
        const result = await handleSlackCommand({ command, text, user_id, user_name });

        // Send the response back to Slack
        res.status(200).json(result);

    } catch (error: any) {
        console.error('Error in Slack API handler:', error);
        res.status(500).json({ text: 'An internal error occurred while processing the command.', response_type: 'ephemeral' });
    }
}
