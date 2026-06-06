import type { Request, Response } from 'express';
import type { StoryTemplate } from '../../domain/StoryTemplate.js';
import type { StoryInstance } from '../../domain/StoryInstance.js';
import type { UseCaseResult } from '../../application/StoryInstanceUseCases.js';

type TemplateHandler<T> = (req: Request, res: Response) => Promise<void>;

function isError<T>(r: UseCaseResult<T>): r is { ok: false; error: string; status: number } {
  return !r.ok;
}

export const createStoryTemplate = (
  useCase: (data: Partial<StoryTemplate>) => Promise<StoryTemplate>
): TemplateHandler<StoryTemplate> => {
  return async (req, res) => {
    const { title, description, initialText, imageUrl, events } = req.body;
    const newStory = await useCase({ title, description, initialText, imageUrl, events });
    res.status(201).json({ message: 'Historia creada', storyId: newStory._id });
  };
};

export const updateStoryTemplateById = (
  useCase: (id: string, data: Partial<StoryTemplate>) => Promise<StoryTemplate | null>
): TemplateHandler<void> => {
  return async (req, res) => {
    const id = req.params.id;
    const { title, description, initialText, imageUrl, events } = req.body;
    const updatedStory = await useCase(id, { title, description, initialText, imageUrl, events });
    if (!updatedStory) {
      res.status(404).json({ message: 'Historia no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Historia actualizada', story: updatedStory });
  };
};

export const getStories = (
  useCase: () => Promise<StoryTemplate[]>
): TemplateHandler<void> => {
  return async (_req, res) => {
    const stories = await useCase();
    res.json(stories);
  };
};

export const deleteStory = (
  useCase: (id: string) => Promise<StoryTemplate | null>
): TemplateHandler<void> => {
  return async (req, res) => {
    const id = req.params.id;
    const deletedStory = await useCase(id);
    if (!deletedStory) {
      res.status(404).json({ message: 'Historia no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Historia eliminada correctamente' });
  };
};

export const startStory = (
  useCase: (templateId: string, userId: string, userInput?: string) => Promise<UseCaseResult<Record<string, unknown>>>
): TemplateHandler<void> => {
  return async (req, res) => {
    const { templateId, userInput } = req.body;
    if (!templateId) {
      res.status(400).json({ message: 'Se requiere templateId' });
      return;
    }
    const user = (req as unknown as { user: { id: string } }).user;
    const result = await useCase(templateId, user.id, userInput);
    if (isError(result)) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    if (userInput) {
      res.json({ storyInstanceId: result.data.storyInstanceId, response: result.data.response });
    } else {
      res.json(result.data);
    }
  };
};

export const getMyStories = (
  useCase: (userId: string) => Promise<StoryInstance[]>
): TemplateHandler<void> => {
  return async (req, res) => {
    const u = (req as unknown as { user: { id: string } }).user;
    const stories = await useCase(u.id);
    res.json(stories);
  };
};

export const chatWithStory = (
  useCase: (id: string, userInput: string) => Promise<UseCaseResult<{ response: string }>>
): TemplateHandler<void> => {
  return async (req, res) => {
    const id = req.params.id;
    const { userInput } = req.body;
    if (!userInput || typeof userInput !== 'string') {
      res.status(400).json({ message: 'Se requiere userInput' });
      return;
    }
    const result = await useCase(id, userInput);
    if (isError(result)) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json({ response: result.data.response });
  };
};

export const getStory = (
  useCase: (id: string, userId: string) => Promise<UseCaseResult<StoryInstance>>
): TemplateHandler<void> => {
  return async (req, res) => {
    const id = req.params.id;
    const user = (req as unknown as { user: { id: string } }).user;
    const result = await useCase(id, user.id);
    if (isError(result)) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json(result.data);
  };
};
