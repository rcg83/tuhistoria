import type { AiService } from '../../domain/ports/AiService.js';
import { continueStory } from '../../../../services/geminiService.js';
import type { GeminiLogParams } from '../../../../services/geminiLog.js';

export const geminiAiService: AiService = {
  async continueStory(
    history: { role: string; parts: { text: string }[] }[],
    prompt: string,
    systemInstruction?: string,
    metadata?: { storyId?: string; userId?: string }
  ): Promise<string> {
    return continueStory(
      history,
      prompt,
      systemInstruction,
      metadata as Pick<GeminiLogParams, 'storyId' | 'userId'> | undefined
    );
  },
};
