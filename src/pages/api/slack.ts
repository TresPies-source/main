// src/pages/api/slack.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { handleSlackCommand, HandleSlackCommandInput, HandleSlackCommandOutput } from '@/ai/flows/handle-slack-command';
import { urlencoded } from 'body-parser';
import { promisify } from 'util';

// Helper to run middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

const urlencodedParser = promisify(urlencoded({ extended: true }));

export default async function handler(req: NextApiRequest, res: NextApiResponse<HandleSlackCommandOutput | { error: string }>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Slack sends data as x-www-form-urlencoded, so we need to parse it.
        await runMiddleware(req, res, urlencodedParser);
        
        const { command, text, user_id } = req.body as HandleSlackCommandInput;

        if (!command || !text || !user_id) {
            return res.status(400).json({ error: 'Missing required Slack fields.' });
        }
        
        // Call the Genkit flow to handle the command logic
        const result = await handleSlackCommand({ command, text, user_id });

        // Send the response back to Slack
        res.status(200).json(result);

    } catch (error: any) {
        console.error('Error in Slack API handler:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
}
