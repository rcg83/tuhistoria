import type { StoryInstanceRepository } from '../domain/StoryInstanceRepository.js';
import type { StoryTemplateRepository } from '../domain/StoryTemplateRepository.js';
import { continueStory } from '../../../services/geminiService.js';

const SYSTEM_PROMPT = `Eres el director de una partida de rol de narración. Describe la historia en segunda persona, como si el lector fuera el protagonista. Usa un tono inmersivo y descriptivo, estilo: "Estás en...", "De repente oyes...", "Frente a ti ves...".
REGLAS DE LONGITUD CRUCIALES:
1. Sé muy conciso. La NARRATIVA debe ocupar como máximo unas 40-50 palabras. No te extiendas.

Responde siempre en el siguiente formato:
<<NARRATIVA>>
tu narrativa aquí
<<RESUMEN>>
resumen actualizado de toda la historia incluyendo esta última acción`;

export const startStoryUseCase = (
  instanceRepo: StoryInstanceRepository,
  templateRepo: StoryTemplateRepository
) => {
  return async (templateId: string, userId: string): Promise<{
    data?: Record<string, unknown>;
    error?: string;
    status?: number;
  }> => {
    const template = await templateRepo.findById(templateId);
    if (!template) {
      return { error: 'Template de la historia no encontrado', status: 404 };
    }
    const story = await instanceRepo.create({
      template: templateId,
      user: userId,
      messages: []
    });
    return { data: { ...story, initialText: template.initialText } };
  };
};

export const getMyStoriesUseCase = (
  instanceRepo: StoryInstanceRepository,
  templateRepo?: StoryTemplateRepository
) => {
  return async (userId: string): Promise<Record<string, unknown>[]> => {
    const stories = await instanceRepo.findByUser(userId);
    if (stories.length === 0 && templateRepo) {
      const templates = await templateRepo.findAll();
      return templates.map((t: Record<string, unknown>) => ({
        _id: t._id,
        template: {
          _id: t._id,
          title: t.title,
          description: t.description,
          initialText: t.initialText,
          imageUrl: t.imageUrl || ''
        },
        messages: []
      }));
    }
    return stories;
  };
};

export const chatWithStoryUseCase = (instanceRepo: StoryInstanceRepository) => {
  return async (id: string, userInput: string): Promise<{
    data?: Record<string, unknown>;
    error?: string;
    status?: number;
  }> => {
    const story = await instanceRepo.findById(id);
    if (!story) {
      return { error: 'Historia no encontrada', status: 404 };
    }

    const template = story.template as Record<string, unknown> | undefined;
    const currentSummary = (story as Record<string, unknown>).summary as string | undefined;
    const history: { role: string; parts: { text: string }[] }[] = [];

    if (currentSummary) {
      history.push(
        { role: 'user', parts: [{ text: `Resume brevemente la historia hasta ahora en una línea.` }] },
        { role: 'model', parts: [{ text: currentSummary }] }
      );
    } else if (template?.initialText) {
      history.push(
        { role: 'user', parts: [{ text: 'Comienza la historia.' }] },
        { role: 'model', parts: [{ text: template.initialText as string }] }
      );
    }

    const prompt = userInput;

    try {
      await instanceRepo.pushMessage(id, { role: 'user', text: userInput, timestamp: new Date() });

      const storyId = (story as Record<string, unknown>)._id as string;
      const userId = (story as Record<string, unknown>).user as string;

      const aiResponse = await continueStory(history, prompt, SYSTEM_PROMPT, { storyId, userId });

      const narrativeMatch = aiResponse.match(/<<NARRATIVA>>\s*([\s\S]*?)\s*<<RESUMEN>>/);
      const summaryMatch = aiResponse.match(/<<RESUMEN>>\s*([\s\S]*)/);

      const narrative = narrativeMatch ? narrativeMatch[1].trim() : aiResponse.trim();
      const newSummary = summaryMatch ? summaryMatch[1].trim() : '';

      await instanceRepo.pushMessage(id, { role: 'model', text: narrative, timestamp: new Date() });

      if (newSummary) {
        await instanceRepo.updateSummary(id, newSummary);
      }

      return { data: { response: narrative } };
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
      return { error: msg, status: 500 };
    }
  };
};

export const getStoryUseCase = (instanceRepo: StoryInstanceRepository) => {
  return async (id: string, userId: string): Promise<{
    data?: Record<string, unknown>;
    error?: string;
    status?: number;
  }> => {
    const story = await instanceRepo.findById(id);
    if (!story) {
      return { error: 'Historia no encontrada', status: 404 };
    }
    if (story.user?.toString() !== userId) {
      return { error: 'No autorizado', status: 403 };
    }
    return { data: story };
  };
};
