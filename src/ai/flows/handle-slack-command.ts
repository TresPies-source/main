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
import { collection, addDoc, Timestamp, query, where, getDocs, onSnapshot, limit } from 'firebase/firestore';

// Note: In a real-world app, you'd have a mapping between Slack user IDs and ZenJar user IDs.
// For this prototype, we'll use a hardcoded user ID for simplicity.
const MOCK_USER_ID = "slack-user-prototype";


export const HandleSlackCommandInputSchema = z.object({
  command: z.string().describe("The main command from Slack (e.g., /zenjar)."),
  text: z.string().describe("The text that follows the command, detailing the action."),
  user_id: z.string().describe("The Slack user ID of the person who invoked the command."),
});
export type HandleSlackCommandInput = z.infer<typeof HandleSlackCommandInputSchema>;

export const HandleSlackCommandOutputSchema = z.object({
    response_type: z.enum(['in_channel', 'ephemeral']).describe("Determines if the response is public or private."),
    text: z.string().describe("The message to send back to Slack."),
});
export type HandleSlackCommandOutput = z.infer<typeof HandleSlackCommandOutputSchema>;


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
    return `Your next task is: *${selectedTask.task}* (Priority: ${selectedTask.priority})`;
}


export async function handleSlackCommand(input: HandleSlackCommandInput): Promise<HandleSlackCommandOutput> {
    const [action, ...rest] = input.text.split(' ');
    const content = rest.join(' ');

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
                userId: MOCK_USER_ID, // Using mock user for prototype
                createdAt: Timestamp.now(),
                completed: false
            });
            return { response_type: 'in_channel', text: `Task added by <@${input.user_id}>: *${task.task}* (Category: ${task.category}, Priority: ${task.priority})` };

        case 'pick':
        case 'draw':
            const drawnTask = await drawTaskFromJar();
            return { response_type: 'ephemeral', text: drawnTask };

        case 'motivate':
        case 'motivation':
            const quote = await getMotivation();
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
}
