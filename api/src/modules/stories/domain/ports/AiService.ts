export interface AiService {
  continueStory(
    history: { role: string; parts: { text: string }[] }[],
    prompt: string,
    systemInstruction?: string,
    metadata?: { storyId?: string; userId?: string }
  ): Promise<string>;
}
