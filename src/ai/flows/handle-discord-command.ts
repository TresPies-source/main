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
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';


// In a real app, map Discord user ID to ZenJar user ID. Using a mock for now.
const MOCK_USER_ID = "discord-user-prototype";

export const HandleDiscordCommandInputSchema = z.object({
  command: z.string().describe("The name of the command."),
  options: z.record(z.any()).optional().describe("The options provided by the user."),
  user_id: z.string().describe("The Discord user ID."),
});
export type HandleDiscordCommandInput = z.infer<typeof HandleDiscordCommandInputSchema>;


export const HandleDiscordCommandOutputSchema = z.object({
  content: z.string().describe("The message to send back to Discord."),
});
export type HandleDiscordCommandOutput = z.infer<typeof HandleDiscordCommandOutputSchema>;

const quotes = [
    "The secret of getting ahead is getting started.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Act as if what you do makes a difference. It does.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
];

async function getMotivation() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

async function drawTaskFromJar() {
    const q = query(collection(db, 'tasks'), where('userId', '==', MOCK_USER_ID), where('completed', '==', false));
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
    const { command, options, user_id } = input;

    switch (command.toLowerCase()) {
        case 'zenjar':
            const subCommand = options?.subcommand; // Assuming subcommand is passed in options
            const taskContent = options?.task;

            if (subCommand === 'add' && taskContent) {
                 const taskResult = await categorizeAndPrioritizeTasks({ tasks: taskContent });
                const task = taskResult[0];
                await addDoc(collection(db, 'tasks'), {
                    ...task,
                    userId: MOCK_USER_ID,
                    createdAt: Timestamp.now(),
                    completed: false
                });
                return { content: `Task added by <@${user_id}>: **${task.task}** (Category: ${task.category}, Priority: ${task.priority})` };
            }
             if (subCommand === 'pick') {
                const drawnTask = await drawTaskFromJar();
                return { content: drawnTask };
            }
            if (subCommand === 'motivate') {
                const quote = await getMotivation();
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
