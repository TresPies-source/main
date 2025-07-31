
'use server';

import { writeBatch, collection, doc, Timestamp, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  categorizeAndPrioritizeTasks,
  type CategorizeAndPrioritizeTasksOutput
} from '@/ai/flows/categorize-and-prioritize-tasks';
import { generateSubtasks } from '@/ai/flows/generate-subtasks';
import { syncWithGoogleTasks } from '@/ai/flows/sync-with-google-tasks';
import { createCalendarEvent } from '@/ai/flows/create-calendar-event';
import { importFromGoogleDoc } from '@/ai/flows/import-from-google-doc';

export type Task = CategorizeAndPrioritizeTasksOutput[0] & { 
    id: string;
    completed: boolean;
    createdAt: Timestamp;
};

export async function processTasks(userId: string, taskInput: string): Promise<CategorizeAndPrioritizeTasksOutput> {
  if (!userId || !taskInput.trim()) {
    throw new Error('User ID and task input are required.');
  }

  const result = await categorizeAndPrioritizeTasks({ tasks: taskInput });
  
  const batch = writeBatch(db);
  result.forEach((task) => {
    const docRef = doc(collection(db, 'tasks'));
    batch.set(docRef, { ...task, userId, createdAt: Timestamp.now(), completed: false });
  });
  await batch.commit();
  
  return result;
}

export async function emptyJar(userId: string) {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId));
}

export async function toggleTask(task: Task) {
  const taskRef = doc(db, 'tasks', task.id);
  await updateDoc(taskRef, { completed: !task.completed });
}

export async function callSyncToGoogleTasks(accessToken: string, tasks: Task[]) {
  const tasksToSync = tasks.map(t => ({
      task: t.task,
      category: t.category,
      priority: t.priority,
      completed: t.completed
  }));
  return await syncWithGoogleTasks({ accessToken, tasks: tasksToSync });
}

export async function callCreateCalendarEvent(accessToken: string, drawnTask: Task) {
    const taskToEvent = { ...drawnTask, createdAt: drawnTask.createdAt.toMillis() };
    return await createCalendarEvent({ accessToken, task: taskToEvent });
}

export async function callGenerateSubtasks(task: Task) {
    return await generateSubtasks({ task: task.task });
}

export async function callImportFromGoogleDoc(accessToken: string, documentId: string) {
    return await importFromGoogleDoc({ accessToken, documentId });
}
