// src/pages/api/discord.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { handleDiscordCommand, HandleDiscordCommandInput, HandleDiscordCommandOutput } from '@/ai/flows/handle-discord-command';

// Discord interaction types (simplified)
const INTERACTION_TYPE = {
    PING: 1,
    APPLICATION_COMMAND: 2,
};

const COMMAND_RESPONSE_TYPE = {
    PONG: 1,
    CHANNEL_MESSAGE_WITH_SOURCE: 4,
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // In a real app, you MUST verify the request signature here.
    // This is a simplified example and skips verification for prototype purposes.
    // See: https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization

    const interaction = req.body;

    try {
        if (interaction.type === INTERACTION_TYPE.PING) {
            // Discord is checking if our endpoint is alive
            return res.status(200).json({ type: COMMAND_RESPONSE_TYPE.PONG });
        }

        if (interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND) {
            const command = interaction.data.name;
            const options: { [key: string]: any } = {};
            if (interaction.data.options) {
                // Remapping options to a simpler key-value object
                 for (const opt of interaction.data.options) {
                    if (opt.type === 1) { // Subcommand
                        options.subcommand = opt.name;
                        // For simplicity, we assume options of the subcommand are at the top level
                        opt.options?.forEach((subOpt: any) => options[subOpt.name] = subOpt.value);
                    } else {
                        options[opt.name] = opt.value;
                    }
                }
            }
            const user_id = interaction.member.user.id;

            // Defer the reply to give our AI flow time to process
            // We will send a follow-up message later. This is now handled by the response.
            // But we need to respond to the initial ping quickly.
            
            // This is a simplified, synchronous response for prototyping.
            // A real-world app should use deferred responses for AI calls.
             const result = await handleDiscordCommand({ command, options, user_id });

            return res.status(200).json({
                type: COMMAND_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: result.content,
                },
            });
        }

        return res.status(400).json({ error: 'Unsupported interaction type.' });

    } catch (error: any) {
        console.error('Error in Discord API handler:', error);
        return res.status(500).json({ error: 'An internal error occurred.' });
    }
}
