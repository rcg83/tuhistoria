import type { Request, Response } from 'express';
import { mongoStoryTemplateRepository } from '../persistence/MongoStoryTemplateRepository.js';
import { mongoStoryInstanceRepository } from '../persistence/MongoStoryInstanceRepository.js';
import { geminiAiService } from '../services/GeminiAiService.js';
import {
  createStoryTemplateUseCase,
  updateStoryTemplateByIdUseCase,
  getStoriesUseCase,
  deleteStoryUseCase,
} from '../../application/StoryTemplateUseCases.js';
import {
  startStoryUseCase,
  getMyStoriesUseCase,
  chatWithStoryUseCase,
  getStoryUseCase,
} from '../../application/StoryInstanceUseCases.js';

const templateRepo = mongoStoryTemplateRepository;
const instanceRepo = mongoStoryInstanceRepository;
const aiService = geminiAiService;

export const createStoryTemplate = async (req: Request, res: Response): Promise<void> => {
  const { title, description, initialText, imageUrl, events } = req.body;
  const useCase = createStoryTemplateUseCase(templateRepo);
  const newStory = await useCase({ title, description, initialText, imageUrl, events });
  res.status(201).json({ message: 'Historia creada', storyId: newStory._id });
};

export const updateStoryTemplateById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { title, description, initialText, imageUrl, events } = req.body;
  const useCase = updateStoryTemplateByIdUseCase(templateRepo);
  const updatedStory = await useCase(id, { title, description, initialText, imageUrl, events });
  if (!updatedStory) {
    res.status(404).json({ message: 'Historia no encontrada' });
    return;
  }
  res.status(200).json({ message: 'Historia actualizada', story: updatedStory });
};

export const getStories = async (_req: Request, res: Response): Promise<void> => {
  const useCase = getStoriesUseCase(templateRepo);
  const stories = await useCase();
  res.json(stories);
};

export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const useCase = deleteStoryUseCase(templateRepo);
  const deletedStory = await useCase(id);
  if (!deletedStory) {
    res.status(404).json({ message: 'Historia no encontrada' });
    return;
  }
  res.status(200).json({ message: 'Historia eliminada correctamente' });
};

export const startStory = async (req: Request, res: Response): Promise<void> => {
  const { templateId, userInput } = req.body;
  if (!templateId) {
    res.status(400).json({ message: 'Se requiere templateId' });
    return;
  }
  const user = (req as unknown as { user: { id: string } }).user;
  const useCase = startStoryUseCase(instanceRepo, templateRepo, aiService);
  const result = await useCase(templateId, user.id, userInput);
  if (!result.ok) {
    res.status(result.status).json({ message: result.error });
    return;
  }
  if (userInput) {
    res.json({ storyInstanceId: result.data.storyInstanceId, response: result.data.response });
  } else {
    res.json(result.data);
  }
};

export const getMyStories = async (req: Request, res: Response): Promise<void> => {
  const u = (req as unknown as { user: { id: string } }).user;
  const useCase = getMyStoriesUseCase(instanceRepo);
  const stories = await useCase(u.id);
  res.json(stories);
};

export const chatWithStory = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { userInput } = req.body;
  if (!userInput || typeof userInput !== 'string') {
    res.status(400).json({ message: 'Se requiere userInput' });
    return;
  }
  const useCase = chatWithStoryUseCase(instanceRepo, aiService);
  const result = await useCase(id, userInput);
  if (!result.ok) {
    res.status(result.status).json({ message: result.error });
    return;
  }
  res.json({ response: result.data.response });
};

export const getStory = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const user = (req as unknown as { user: { id: string } }).user;
  const useCase = getStoryUseCase(instanceRepo);
  const result = await useCase(id, user.id);
  if (!result.ok) {
    res.status(result.status).json({ message: result.error });
    return;
  }
  res.json(result.data);
};
