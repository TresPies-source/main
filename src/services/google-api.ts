
// This file will contain the logic to interact with Google APIs.
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Stream } from 'stream';

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
        const existingTasks = await tasksService.tasks.list({ tasklist: tasklistId, showCompleted: true, showHidden: true });
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


export async function exportDataToGoogleDrive(accessToken: string, userData: any) {
    try {
        const auth = await getAuthenticatedClient(accessToken);
        const driveService = google.drive({ version: 'v3', auth });

        const fileName = `zenjar-export-${new Date().toISOString()}.json`;
        const fileContent = JSON.stringify(userData, null, 2);
        
        const bufferStream = new Stream.PassThrough();
        bufferStream.end(Buffer.from(fileContent, 'utf-8'));


        const fileMetadata = {
            name: fileName,
            parents: ['root'], // 'root' for the main "My Drive" folder
        };

        const media = {
            mimeType: 'application/json',
            body: bufferStream,
        };

        const file = await driveService.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        if (!file.data.webViewLink) {
            throw new Error("File was created but no link was returned.");
        }

        return {
            success: true,
            message: `Successfully exported your data to '${fileName}' in your Google Drive.`,
            fileLink: file.data.webViewLink,
        };
    } catch (error: any) {
        console.error("Error exporting data to Google Drive:", error);
        if (error.response?.data?.error_description) {
            throw new Error(`Google API Error: ${error.response.data.error_description}`);
        }
        throw new Error("Failed to export data to Google Drive. Please try reconnecting your account.");
    }
}

export async function getGoogleDocContent(accessToken: string, documentId: string) {
    try {
        const auth = await getAuthenticatedClient(accessToken);
        const docsService = google.docs({ version: 'v1', auth });

        const doc = await docsService.documents.get({
            documentId: documentId,
        });

        let text = '';
        doc.data.body?.content?.forEach(element => {
            if (element.paragraph) {
                element.paragraph.elements?.forEach(paraElement => {
                    if (paraElement.textRun && paraElement.textRun.content) {
                        text += paraElement.textRun.content;
                    }
                });
            }
        });

        return {
            success: true,
            content: text,
            message: "Successfully fetched document content."
        };

    } catch (error: any) {
        console.error("Error fetching Google Doc content:", error);
        if (error.response?.data?.error?.message) {
            throw new Error(`Google API Error: ${error.response.data.error.message}`);
        }
        throw new Error("Failed to fetch Google Doc content. Ensure the document is accessible.");
    }
}
