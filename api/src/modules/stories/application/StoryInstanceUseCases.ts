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

export const getMyStoriesUseCase = (instanceRepo: StoryInstanceRepository) => {
  return async (userId: string): Promise<Record<string, unknown>[]> => {
    const stories = await instanceRepo.findByUser(userId);
    if (stories.length === 0) {
      return [
        {
          _id: 'mock-titanic-001',
          template: {
            _id: 'mock-titanic-tpl',
            title: 'La última noche del Titanic',
            description: 'Estamos a bordo del Titanic en su viaje inaugural. La noche del 14 de abril de 1912, algo está a punto de ocurrir...',
            initialText: 'La noche es fría y el océano está en calma...',
            imageUrl: ''
          },
          messages: []
        },
        {
          _id: 'mock-medusa-002',
          template: {
            _id: 'mock-medusa-tpl',
            title: 'La isla de la Medusa',
            description: 'Una expedición en busca de la mítica isla donde habita la Medusa. Entre niebla y leyendas, nada es lo que parece.',
            initialText: 'El barco corta la niebla mientras el vigía grita: "¡Tierra a la vista!"...',
            imageUrl: ''
          },
          messages: []
        }
      ];
    }
    return stories;
  };
};

export const chatWithStoryUseCase = (instanceRepo: StoryInstanceRepository) => {
  return async (id: string, userInput: string): Promise<{
    data?: Record<string, unknown>;
    error?: string;
    status?: number;
  } | undefined> => {
    const story = await instanceRepo.findById(id);
    if (!story) {
      return { error: 'Historia no encontrada', status: 404 };
    }
    const history = ((story.messages as { role: string; text: string }[]) || []).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    try {
      const aiResponse = await continueStory(history, userInput);
    } catch (error) {
    }
  };
};
