import type { StoryInstanceRepository } from '../domain/StoryInstanceRepository.js';
import type { StoryTemplateRepository } from '../domain/StoryTemplateRepository.js';
import type { AiService } from '../domain/ports/AiService.js';
import type { StoryTemplate } from '../domain/StoryTemplate.js';
import type { StoryInstance } from '../domain/StoryInstance.js';

export type UseCaseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

const SYSTEM_PROMPT = `Eres el director de una partida de rol de narración. Describe la historia en segunda persona, como si el lector fuera el protagonista. Usa un tono inmersivo y descriptivo, estilo: "Estás en...", "De repente oyes...", "Frente a ti ves...".
REGLAS DE LONGITUD CRUCIALES:
1. Sé muy conciso. La NARRATIVA debe ocupar como máximo unas 40-50 palabras. No te extiendas.

Responde siempre en el siguiente formato:
<<NARRATIVA>>
tu narrativa aquí
<<RESUMEN>>
resumen actualizado de toda la historia incluyendo esta última acción`;

function parseAiResponse(aiResponse: string): { narrative: string; summary: string } {
  const narrativeMatch = aiResponse.match(/<<NARRATIVA>>\s*([\s\S]*?)\s*<<RESUMEN>>/);
  const summaryMatch = aiResponse.match(/<<RESUMEN>>\s*([\s\S]*)/);
  return {
    narrative: narrativeMatch ? narrativeMatch[1].trim() : aiResponse.trim(),
    summary: summaryMatch ? summaryMatch[1].trim() : '',
  };
}

export const startStoryUseCase = (
  instanceRepo: StoryInstanceRepository,
  templateRepo: StoryTemplateRepository,
  aiService: AiService
) => {
  return async (templateId: string, userId: string, userInput?: string): Promise<UseCaseResult<Record<string, unknown>>> => {
    const template = await templateRepo.findById(templateId);
    if (!template) {
      return { ok: false, error: 'Template de la historia no encontrado', status: 404 };
    }

    if (!userInput) {
      const story = await instanceRepo.create({
        template: templateId,
        user: userId,
        messages: [],
      });
      return {
        ok: true,
        data: {
          storyInstanceId: story._id,
          templateId,
          initialText: template.initialText,
          title: template.title,
          description: template.description,
          imageUrl: template.imageUrl,
        },
      };
    }

    const story = await instanceRepo.create({
      template: templateId,
      user: userId,
      messages: [],
    });

    const storyId = story._id!;
    await instanceRepo.pushMessage(storyId, { role: 'user', text: userInput, timestamp: new Date() });

    const history: { role: string; parts: { text: string }[] }[] = [];
    if (template.initialText) {
      history.push(
        { role: 'user', parts: [{ text: 'Comienza la historia.' }] },
        { role: 'model', parts: [{ text: template.initialText }] }
      );
    }

    try {
      const aiResponse = await aiService.continueStory(history, userInput, SYSTEM_PROMPT, { storyId, userId });
      const { narrative, summary } = parseAiResponse(aiResponse);

      await instanceRepo.pushMessage(storyId, { role: 'model', text: narrative, timestamp: new Date() });
      if (summary) {
        await instanceRepo.updateSummary(storyId, summary);
      }

      return { ok: true, data: { storyInstanceId: storyId, response: narrative } };
    } catch (error) {
      let msg = 'Error al comunicarse con la IA';
      if (error instanceof Error) {
        const fetchError = error as unknown as Record<string, unknown>;
        if (fetchError.status === 503) {
          msg = 'El servicio de IA está saturado. Intenta de nuevo en unos segundos.';
        } else {
          msg = error.message;
        }
      }
      return { ok: false, error: msg, status: 500 };
    }
  };
};

export const getMyStoriesUseCase = (instanceRepo: StoryInstanceRepository) => {
  return async (userId: string): Promise<StoryInstance[]> => {
    const stories = await instanceRepo.findByUser(userId);
    return stories.filter(s => s.messages && s.messages.length > 0);
  };
};

export const chatWithStoryUseCase = (instanceRepo: StoryInstanceRepository, aiService: AiService) => {
  return async (id: string, userInput: string): Promise<UseCaseResult<{ response: string }>> => {
    const story = await instanceRepo.findById(id);
    if (!story) {
      return { ok: false, error: 'Historia no encontrada', status: 404 };
    }

    const template = story.template as Record<string, unknown> | undefined;
    const currentSummary = story.summary;
    const messages = story.messages;
    const history: { role: string; parts: { text: string }[] }[] = [];

    if (currentSummary) {
      history.push(
        { role: 'user', parts: [{ text: 'Resume brevemente la historia hasta ahora en una línea.' }] },
        { role: 'model', parts: [{ text: currentSummary }] }
      );
    } else if (template?.initialText) {
      history.push(
        { role: 'user', parts: [{ text: 'Comienza la historia.' }] },
        { role: 'model', parts: [{ text: template.initialText as string }] }
      );
    }

    const userMsgCount = messages?.filter(m => m.role === 'user').length ?? 0;
    const eventNumber = userMsgCount + 1;
    const events = template?.events as { messageNumber: number; prompt: string }[] | undefined;
    const matchingEvent = events?.find(e => e.messageNumber === eventNumber);

    const prompt = matchingEvent
      ? `${userInput}\n\n[EVENTO: ${matchingEvent.prompt}]`
      : userInput;

    try {
      await instanceRepo.pushMessage(id, { role: 'user', text: userInput, timestamp: new Date() });

      const storyId = story._id!;
      const userId = (story.user as string);

      const aiResponse = await aiService.continueStory(history, prompt, SYSTEM_PROMPT, { storyId, userId });
      const { narrative, summary } = parseAiResponse(aiResponse);

      await instanceRepo.pushMessage(id, { role: 'model', text: narrative, timestamp: new Date() });
      if (summary) {
        await instanceRepo.updateSummary(id, summary);
      }

      return { ok: true, data: { response: narrative } };
    } catch (error) {
      let msg = 'Error al comunicarse con la IA';
      if (error instanceof Error) {
        const fetchError = error as unknown as Record<string, unknown>;
        if (fetchError.status === 503) {
          msg = 'El servicio de IA está saturado. Intenta de nuevo en unos segundos.';
        } else {
          msg = error.message;
        }
      }
      return { ok: false, error: msg, status: 500 };
    }
  };
};

export const getStoryUseCase = (instanceRepo: StoryInstanceRepository) => {
  return async (id: string, userId: string): Promise<UseCaseResult<StoryInstance>> => {
    const story = await instanceRepo.findById(id);
    if (!story) {
      return { ok: false, error: 'Historia no encontrada', status: 404 };
    }
    if (story.user?.toString() !== userId) {
      return { ok: false, error: 'No autorizado', status: 403 };
    }
    return { ok: true, data: story };
  };
};
