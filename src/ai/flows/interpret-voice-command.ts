'use server';
/**
 * @fileOverview A Natural Language Understanding (NLU) flow for interpreting voice commands.
 *
 * - interpretVoiceCommand - A function that processes transcribed text to identify user intent and entities.
 * - InterpretVoiceCommandInput - The input type for the interpretVoiceCommand function.
 * - InterpretVoiceCommandOutput - The return type for the interpretVoiceCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InterpretVoiceCommandInputSchema = z.object({
  command: z.string().describe('The transcribed voice command from the user.'),
});
export type InterpretVoiceCommandInput = z.infer<typeof InterpretVoiceCommandInputSchema>;

const InterpretVoiceCommandOutputSchema = z.object({
    intent: z.enum(['addTask', 'getMotivation', 'addGratitude', 'setIntention', 'unknown'])
        .describe("The user's intent. Should be one of the specified values."),
    entity: z.string().optional().describe("The content associated with the intent, like the task description or gratitude entry. This can be empty for intents like 'getMotivation'.")
});
export type InterpretVoiceCommandOutput = z.infer<typeof InterpretVoiceCommandOutputSchema>;

export async function interpretVoiceCommand(
  input: InterpretVoiceCommandInput
): Promise<InterpretVoiceCommandOutput> {
  return interpretVoiceCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretVoiceCommandPrompt',
  input: { schema: InterpretVoiceCommandInputSchema },
  output: { schema: InterpretVoiceCommandOutputSchema },
  prompt: `You are the Natural Language Understanding (NLU) engine for the ZenJar app. Your job is to interpret the user's transcribed voice command and determine their intent and any associated content (entity).

The possible intents are:
- 'addTask': When the user wants to add a new task.
- 'getMotivation': When the user asks for a motivational quote or inspiration.
- 'addGratitude': When the user expresses something they are grateful for.
- 'setIntention': When the user wants to set their daily intention.
- 'unknown': If the command does not match any of the above intents.

Extract the core content of the command as the 'entity'. For example:
- "Add task to buy groceries" -> intent: 'addTask', entity: 'buy groceries'
- "I'm grateful for my family" -> intent: 'addGratitude', entity: 'my family'
- "Set my intention to finish the report" -> intent: 'setIntention', entity: 'finish the report'
- "Give me some motivation" -> intent: 'getMotivation', entity: null
- "What's the weather like?" -> intent: 'unknown', entity: 'What\'\'s the weather like?'

User Command: {{{command}}}`,
});

const interpretVoiceCommandFlow = ai.defineFlow(
  {
    name: 'interpretVoiceCommandFlow',
    inputSchema: InterpretVoiceCommandInputSchema,
    outputSchema: InterpretVoiceCommandOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
