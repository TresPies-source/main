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

// This can be moved to a shared utility file.
const quotes = [
    "The secret of getting ahead is getting started.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Act as if what you do makes a difference. It does.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
];

async function getMotivation(zenJarUserId: string) {
    // In a production app, this could also pull from user's custom affirmations.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

async function drawTaskFromJar(zenJarUserId: string) {
    const q = query(collection(db, 'tasks'), where('userId', '==', zenJarUserId), where('completed', '==', false));
    const querySnapshot = await getDocs(q);
    const pendingTasks: any[] = [];
    querySnapshot.forEach((doc) => {
        pendingTasks.push({ ...doc.data(), id: doc.id });
    });

    if (pendingTasks.length === 0) {
        return "Your Task Jar is empty! Add some tasks with `/zenjar add [your task]`."
    }

    const weightedList = pendingTasks.flatMap(task => Array(task.priority).fill(task));
    const randomIndex = Math.floor(Math.random() * weightedList.length);
    const selectedTask = weightedList[randomIndex];
    return `Your next task is: **${selectedTask.task}** (Priority: ${selectedTask.priority})`;
}


export async function handleDiscordCommand(input: HandleDiscordCommandInput): Promise<HandleDiscordCommandOutput> {
    const { command, options, discordUserId, discordUserName } = input;
    
    // Check if the Discord user has linked their ZenJar account.
    const zenJarUserId = await getZenJarUserIdFromDiscordId(discordUserId);
    if (!zenJarUserId) {
        return { content: `Hey @${discordUserName}! To use ZenJar, you first need to link your Discord account from the settings page in the ZenJar app.`};
    }

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
}
