import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-and-prioritize-tasks.ts';
import '@/ai/flows/analyze-gratitude-patterns.ts';
import '@/ai/flows/generate-encouraging-response.ts';
import '@/ai/flows/generate-subtasks.ts';
import '@/ai/flows/sync-with-google-tasks.ts';
