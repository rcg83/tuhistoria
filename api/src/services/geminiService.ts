import { GoogleGenerativeAI } from "@google/generative-ai";
import { logGeminiRequest, type GeminiLogParams } from './geminiLog.js';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const testGemini = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const continueStory = async (
  history: { role: string; parts: { text: string }[] }[],
  prompt: string,
  systemInstruction?: string,
  metadata?: Pick<GeminiLogParams, 'storyId' | 'userId'>
): Promise<string> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    ...(systemInstruction ? { systemInstruction: { role: 'user', parts: [{ text: systemInstruction }] } } : {})
  });

  const chat = model.startChat({
    history: history
  });

  const TIMEOUT_MS = 25000;
  const start = performance.now();

  try {
    const result = await Promise.race([
      chat.sendMessage(prompt),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('La IA no respondió a tiempo')), TIMEOUT_MS)
      )
    ]);

    const rawResponse = result.response.text();
    const durationMs = Math.round(performance.now() - start);

    logGeminiRequest({
      storyId: metadata?.storyId,
      userId: metadata?.userId,
      systemPrompt: systemInstruction,
      history,
      userInput: prompt,
      rawResponse,
      durationMs,
      success: true,
    });

    return rawResponse;
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

    logGeminiRequest({
      storyId: metadata?.storyId,
      userId: metadata?.userId,
      systemPrompt: systemInstruction,
      history,
      userInput: prompt,
      durationMs,
      success: false,
      error: errorMessage,
    });

    throw err;
  }
};
