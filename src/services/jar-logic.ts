// src/services/jar-logic.ts

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

/**
 * A curated list of default motivational quotes.
 */
const defaultQuotes = [
  "You don’t always get what you wish for; you get what you work for.",
  "Believe you can, and you’re already halfway there.",
  "Expect things of yourself before you can do them.",
  "Progress, not perfection.",
  "A small step today leads to a big leap tomorrow.",
  "Done is better than perfect.",
  "If not now, when?",
  "Your future self will thank you for starting today.",
  "Motivation follows action—just begin.",
  "One minute of work leads to many more.",
  "Break it down and build it up.",
  "You have the power in this moment.",
  "Consistency beats intensity over time.",
  "Stop thinking. Start doing.",
  "Every task completed is a win.",
];

/**
 * Fetches all affirmations (default + custom) for a user and returns a random one.
 * @param zenJarUserId The user's unique ID.
 * @returns A random motivational string.
 */
export async function getMotivation(zenJarUserId: string): Promise<string> {
    const q = query(
        collection(db, 'affirmations'), 
        where('userId', '==', zenJarUserId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const userAffirmations = snapshot.docs.map(doc => doc.data().text as string);
    
    const allQuotes = [...defaultQuotes, ...userAffirmations];

    if (allQuotes.length === 0) {
        return "Add an affirmation in the Motivation Jar to get started!";
    }
    
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    return allQuotes[randomIndex];
}

/**
 * Fetches a user's pending tasks, applies weighting based on priority, and returns a random task.
 * @param zenJarUserId The user's unique ID.
 * @returns A string describing the selected task, or a message if no tasks are available.
 */
export async function drawTaskFromJar(zenJarUserId: string): Promise<string> {
    const q = query(
        collection(db, 'tasks'), 
        where('userId', '==', zenJarUserId), 
        where('completed', '==', false)
    );
    const querySnapshot = await getDocs(q);
    const pendingTasks: any[] = [];
    querySnapshot.forEach((doc) => {
        pendingTasks.push({ ...doc.data(), id: doc.id });
    });

    if (pendingTasks.length === 0) {
        return "Your Task Jar is empty! Add some tasks with `/zenjar add [your task]`."
    }

    const weightedList = pendingTasks.flatMap(task => Array(task.priority || 1).fill(task));
    const randomIndex = Math.floor(Math.random() * weightedList.length);
    const selectedTask = weightedList[randomIndex];
    
    return `Your next task is: **${selectedTask.task}** (Priority: ${selectedTask.priority})`;
}
