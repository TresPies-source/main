import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-and-prioritize-tasks.ts';
import '@/ai/flows/analyze-gratitude-patterns.ts';
import '@/ai/flows/generate-encouraging-response.ts';
import '@/ai/flows/generate-subtasks.ts';
import '@/ai/flows/sync-with-google-tasks.ts';
import '@/ai/flows/create-calendar-event.ts';
import '@/ai/flows/interpret-voice-command.ts';
import '@/ai/flows/handle-slack-command.ts';
import '@/ai/flows/handle-discord-command.ts';
import '@/ai/flows/export-to-drive.ts';
