// src/pages/api/discord.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { handleDiscordCommand } from '@/ai/flows/handle-discord-command';

// In a real app, you would use a library like 'discord-interactions' to handle verification.
// const { verifyKey } = require('discord-interactions');

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

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
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // In a real app, you MUST verify the request signature here.
    // This is a simplified example and skips verification for prototype purposes.
    // To implement, get your public key from the Discord Developer Portal.
    if (DISCORD_PUBLIC_KEY) {
        // const signature = req.headers['x-signature-ed25519'];
        // const timestamp = req.headers['x-signature-timestamp'];
        // const body = req.body; // Raw body is needed, this might require custom body parser config

        // const isVerified = verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY);
        // if (!isVerified) {
        //     console.error('Invalid Discord request signature.');
        //     return res.status(401).end('invalid request signature');
        // }
    } else if (process.env.NODE_ENV === 'production') {
        console.error("DISCORD_PUBLIC_KEY is not set. Signature verification is required in production.");
        return res.status(500).json({ error: "Server configuration error." });
    } else {
        console.warn("Discord signature verification skipped. Set DISCORD_PUBLIC_KEY for production.")
    }


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
            const user_name = interaction.member.user.username;

            
            // This is a simplified, synchronous response for prototyping.
            // A real-world app should use deferred responses for AI calls to avoid timeouts.
             const result = await handleDiscordCommand({ command, options, discordUserId: user_id, discordUserName: user_name });

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
        return res.status(500).json({ data: { content: 'An internal error occurred while processing the command.'} });
    }
}
