// This file will contain the logic to interact with Google APIs.
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

type Task = {
    task: string;
    category: string;
    priority: number;
    completed: boolean;
};

const TASKLIST_TITLE = 'ZenJar Tasks';

async function getAuthenticatedClient(accessToken: string): Promise<OAuth2Client> {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
}

export async function syncToGoogleTasks(accessToken: string, tasks: Task[]) {
    try {
        const auth = await getAuthenticatedClient(accessToken);
        const tasksService = google.tasks({ version: 'v1', auth });

        // 1. Find or create the "ZenJar Tasks" list
        const tasklists = await tasksService.tasklists.list();
        let tasklist = tasklists.data.items?.find(tl => tl.title === TASKLIST_TITLE);

        if (!tasklist || !tasklist.id) {
            const newTaskList = await tasksService.tasklists.insert({
                requestBody: {
                    title: TASKLIST_TITLE,
                },
            });
            tasklist = newTaskList.data;
        }

        if (!tasklist.id) {
            throw new Error("Could not find or create the ZenJar task list.");
        }
        
        const tasklistId = tasklist.id;

        // 2. Clear existing tasks in the list to prevent duplicates (optional, but good for a "sync")
        const existingTasks = await tasksService.tasks.list({ tasklist: tasklistId });
        if(existingTasks.data.items) {
            for (const task of existingTasks.data.items) {
                if (task.id) {
                    await tasksService.tasks.delete({ tasklist: tasklistId, task: task.id });
                }
            }
        }


        // 3. Add all current tasks from ZenJar
        for (const task of tasks) {
            await tasksService.tasks.insert({
                tasklist: tasklistId,
                requestBody: {
                    title: task.task,
                    notes: `Category: ${task.category}\nPriority: ${task.priority}`,
                    status: task.completed ? 'completed' : 'needsAction'
                }
            });
        }
        
        return {
            success: true,
            message: `Successfully synced ${tasks.length} tasks to your '${TASKLIST_TITLE}' list.`,
            tasklistLink: `https://mail.google.com/tasks/canvas?pli=1&tasklist=${tasklistId}`
        };

    } catch (error: any) {
        console.error("Error syncing with Google Tasks:", error);
        // This helps in debugging OAuth issues.
        if (error.response?.data?.error_description) {
             throw new Error(`Google API Error: ${error.response.data.error_description}`);
        }
        throw new Error("Failed to sync tasks with Google. Please try reconnecting your account.");
    }
}


export async function createGoogleCalendarEvent(accessToken: string, task: any) {
    try {
        const auth = await getAuthenticatedClient(accessToken);
        const calendarService = google.calendar({ version: 'v3', auth });

        const eventStartTime = new Date();
        const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000); // 1 hour later

        const event = {
            summary: task.task,
            description: `From your ZenJar.\nCategory: ${task.category}\nPriority: ${task.priority}`,
            start: {
                dateTime: eventStartTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: eventEndTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        };

        const createdEvent = await calendarService.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        return {
            success: true,
            message: 'Successfully created a 1-hour event in your primary Google Calendar.',
            eventLink: createdEvent.data.htmlLink,
        };

    } catch (error: any) {
        console.error("Error creating Google Calendar event:", error);
        if (error.response?.data?.error_description) {
            throw new Error(`Google API Error: ${error.response.data.error_description}`);
        }
        throw new Error("Failed to create event in Google Calendar. Please try reconnecting your account.");
    }
}
