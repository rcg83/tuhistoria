import type { StoryInstanceRepository } from '../domain/StoryInstanceRepository.js';
import type { StoryTemplateRepository } from '../domain/StoryTemplateRepository.js';
import { continueStory } from '../../../services/geminiService.js';

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
    return { data: story };
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
    const history: { role: string; parts: { text: string }[] }[] = [];

    if (template?.initialText) {
      history.push(
        { role: 'user', parts: [{ text: 'Eres un narrador de historias. Continúa la siguiente historia de forma natural e inmersiva.' }] },
        { role: 'model', parts: [{ text: template.initialText as string }] }
      );
    }

    const msgs = (story.messages as { role: string; text: string }[]) || [];
    for (const msg of msgs) {
      history.push({ role: msg.role, parts: [{ text: msg.text }] });
    }

    try {
      await instanceRepo.pushMessage(id, { role: 'user', text: userInput, timestamp: new Date() });

      const aiResponse = await continueStory(history, userInput);

      await instanceRepo.pushMessage(id, { role: 'model', text: aiResponse, timestamp: new Date() });

      return { data: { response: aiResponse } };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al comunicarse con la IA';
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
