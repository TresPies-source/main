'use server';

/**
 * @fileOverview A flow to handle slash commands from Discord.
 * 
 * - handleDiscordCommand - A function that processes a Discord command and returns a response.
 * - HandleDiscordCommandInput - The input type for the handleDiscordCommand function.
 * - HandleDiscordCommandOutput - The return type for the handleDiscordCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { categorizeAndPrioritizeTasks } from './categorize-and-prioritize-tasks';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { drawTaskFromJar, getMotivation } from '@/services/jar-logic';


// In a real app, you would look up the ZenJar user ID associated with the Discord user ID.
// This requires an OAuth flow where the user links their accounts, typically in the app's settings.
async function getZenJarUserIdFromDiscordId(discordUserId: string): Promise<string | null> {
    const userMappingQuery = query(
        collection(db, 'userMappings'), 
        where('discordId', '==', discordUserId),
        limit(1)
    );
    const snapshot = await getDocs(userMappingQuery);
    if (snapshot.empty) {
        return null; // User has not linked their account
    }
    return snapshot.docs[0].data().zenJarUserId;
}


export const HandleDiscordCommandInputSchema = z.object({
  command: z.string().describe("The name of the command."),
  options: z.record(z.any()).optional().describe("The options provided by the user."),
  discordUserId: z.string().describe("The Discord user ID."),
  discordUserName: z.string().describe("The Discord user's display name.")
});
export type HandleDiscordCommandInput = z.infer<typeof HandleDiscordCommandInputSchema>;


export const HandleDiscordCommandOutputSchema = z.object({
  content: z.string().describe("The message to send back to Discord."),
});
export type HandleDiscordCommandOutput = z.infer<typeof HandleDiscordCommandOutputSchema>;


export async function handleDiscordCommand(input: HandleDiscordCommandInput): Promise<HandleDiscordCommandOutput> {
    const { command, options, discordUserId, discordUserName } = input;
    
    // Check if the Discord user has linked their ZenJar account.
    const zenJarUserId = await getZenJarUserIdFromDiscordId(discordUserId);
    if (!zenJarUserId) {
        return { content: `Hey @${discordUserName}! To use ZenJar, you first need to link your Discord account from the settings page in the ZenJar app.`};
    }

    try {
        switch (command.toLowerCase()) {
            case 'zenjar':
                const subCommand = options?.subcommand;
                const taskContent = options?.task;

                if (subCommand === 'add' && taskContent) {
                    const taskResult = await categorizeAndPrioritizeTasks({ tasks: taskContent });
                    const task = taskResult[0];
                    await addDoc(collection(db, 'tasks'), {
                        ...task,
                        userId: zenJarUserId,
                        createdAt: Timestamp.now(),
                        completed: false
                    });
                    return { content: `Task added for <@${discordUserId}>: **${task.task}** (Category: ${task.category}, Priority: ${task.priority})` };
                }
                if (subCommand === 'pick') {
                    const drawnTask = await drawTaskFromJar(zenJarUserId);
                    return { content: drawnTask };
                }
                if (subCommand === 'motivate') {
                    const quote = await getMotivation(zenJarUserId);
                    return { content: `Here's a little motivation for you:\n> ${quote}` };
                }
                
                const helpText = "Here are the commands you can use with `/zenjar`:\n" +
                                "`add [task]`: Adds a new task to your jar.\n" +
                                "`pick`: Randomly draws a task from your jar.\n" +
                                "`motivate`: Gives you a dose of motivation.\n" +
                                "`help`: Shows this help message.";
                return { content: helpText };

            default:
                return { content: "Sorry, I didn't recognize that command. Try `/zenjar help`." };
        }
    } catch (error: any) {
        console.error("Error processing Discord command: ", error);
        return { content: "Sorry, there was an error trying to process your command. Please try again later." };
    }
}
