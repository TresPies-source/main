'use server';

/**
 * @fileOverview A flow to handle slash commands from Slack.
 * 
 * - handleSlackCommand - A function that processes a Slack command and returns a response.
 * - HandleSlackCommandInput - The input type for the handleSlackCommand function.
 * - HandleSlackCommandOutput - The return type for the handleSlackCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { categorizeAndPrioritizeTasks } from './categorize-and-prioritize-tasks';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { drawTaskFromJar, getMotivation } from '@/services/jar-logic';


// In a real app, you would look up the ZenJar user ID associated with the Slack user ID.
// This requires an OAuth flow where the user links their accounts, typically in the app's settings.
async function getZenJarUserIdFromSlackId(slackUserId: string): Promise<string | null> {
    const userMappingQuery = query(
        collection(db, 'userMappings'), 
        where('slackId', '==', slackUserId),
        limit(1)
    );
    const snapshot = await getDocs(userMappingQuery);
    if (snapshot.empty) {
        return null; // User has not linked their account
    }
    return snapshot.docs[0].data().zenJarUserId;
}

export const HandleSlackCommandInputSchema = z.object({
  command: z.string().describe("The main command from Slack (e.g., /zenjar)."),
  text: z.string().describe("The text that follows the command, detailing the action."),
  user_id: z.string().describe("The Slack user ID of the person who invoked the command."),
  user_name: z.string().describe("The Slack user's display name.")
});
export type HandleSlackCommandInput = z.infer<typeof HandleSlackCommandInputSchema>;

export const HandleSlackCommandOutputSchema = z.object({
    response_type: z.enum(['in_channel', 'ephemeral']).describe("Determines if the response is public or private."),
    text: z.string().describe("The message to send back to Slack."),
});
export type HandleSlackCommandOutput = z.infer<typeof HandleSlackCommandOutputSchema>;


export async function handleSlackCommand(input: HandleSlackCommandInput): Promise<HandleSlackCommandOutput> {
    const { text, user_id, user_name } = input;
    const [action, ...rest] = text.split(' ');
    const content = rest.join(' ');
    
    // Check if the Slack user has linked their ZenJar account.
    const zenJarUserId = await getZenJarUserIdFromSlackId(user_id);
    if (!zenJarUserId) {
        return { 
            response_type: 'ephemeral', 
            text: `Hey @${user_name}! To use ZenJar, you first need to link your Slack account from the settings page in the ZenJar app.` 
        };
    }

    try {
        switch (action.toLowerCase()) {
            case 'add':
            case 'task':
                if (!content) {
                    return { response_type: 'ephemeral', text: "Please provide a task to add. Usage: `/zenjar add [your task description]`" };
                }
                const taskResult = await categorizeAndPrioritizeTasks({ tasks: content });
                const task = taskResult[0];
                await addDoc(collection(db, 'tasks'), {
                    ...task,
                    userId: zenJarUserId,
                    createdAt: Timestamp.now(),
                    completed: false
                });
                return { response_type: 'in_channel', text: `Task added by <@${user_id}>: *${task.task}* (Category: ${task.category}, Priority: ${task.priority})` };

            case 'pick':
            case 'draw':
                const drawnTask = await drawTaskFromJar(zenJarUserId);
                return { response_type: 'ephemeral', text: drawnTask };

            case 'motivate':
            case 'motivation':
                const quote = await getMotivation(zenJarUserId);
                return { response_type: 'ephemeral', text: `Here's a little motivation for you:\n>"${quote}"` };

            case 'help':
                const helpText = "Here are the commands you can use with `/zenjar`:\n" +
                                "`add [task]`: Adds a new task to your jar.\n" +
                                "`pick`: Randomly draws a task from your jar.\n" +
                                "`motivate`: Gives you a dose of motivation.\n" +
                                "`help`: Shows this help message.";
                return { response_type: 'ephemeral', text: helpText };

            default:
                return { response_type: 'ephemeral', text: "Sorry, I didn't recognize that command. Try `/zenjar help` to see what I can do." };
        }
    } catch(error: any) {
        console.error("Error processing Slack command: ", error);
        return { response_type: 'ephemeral', text: "Sorry, there was an error trying to process your command. Please try again later." };
    }
}
