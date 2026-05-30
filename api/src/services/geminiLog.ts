import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const LOG_DIR = join(process.cwd(), 'logs');
const LOG_FILE = join(LOG_DIR, 'gemini.log');

async function ensureLogDir(): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
  } catch {
    // directory already exists
  }
}

export interface GeminiLogParams {
  storyId?: string;
  userId?: string;
  systemPrompt?: string;
  history: { role: string; parts: { text: string }[] }[];
  userInput: string;
  rawResponse?: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

export async function logGeminiRequest(params: GeminiLogParams): Promise<void> {
  try {
    await ensureLogDir();

    const entry = {
      timestamp: new Date().toISOString(),
      event: 'gemini_request',
      storyId: params.storyId ?? null,
      userId: params.userId ?? null,
      systemPrompt: params.systemPrompt ?? null,
      history: params.history,
      userInput: params.userInput,
      rawResponse: params.rawResponse ?? null,
      durationMs: params.durationMs,
      success: params.success,
      error: params.error ?? null,
    };

    await appendFile(LOG_FILE, JSON.stringify(entry) + '\n', 'utf-8');
  } catch {
    // silently fail — logging should never break the app
  }
}
