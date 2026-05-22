import type { Request, Response } from 'express';
import { mongoStoryTemplateRepository } from '../persistence/MongoStoryTemplateRepository.js';
import { mongoStoryInstanceRepository } from '../persistence/MongoStoryInstanceRepository.js';
import {
  createStoryTemplateUseCase,
  updateStoryTemplateByIdUseCase,
  getStoriesUseCase,
  deleteStoryUseCase
} from '../../application/StoryTemplateUseCases.js';
import {
  startStoryUseCase,
  getMyStoriesUseCase,
  chatWithStoryUseCase
} from '../../application/StoryInstanceUseCases.js';

const templateRepo = mongoStoryTemplateRepository;
const instanceRepo = mongoStoryInstanceRepository;

const create = createStoryTemplateUseCase(templateRepo);
const update = updateStoryTemplateByIdUseCase(templateRepo);
const list = getStoriesUseCase(templateRepo);
const remove = deleteStoryUseCase(templateRepo);
const start = startStoryUseCase(instanceRepo, templateRepo);
const myStories = getMyStoriesUseCase(instanceRepo);
const chat = chatWithStoryUseCase(instanceRepo);

export const createStoryTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, initialText, imageUrl } = req.body;
    const newStory = await create({ title, description, initialText, imageUrl });
    res.status(201).json({ message: 'Historia creada', storyId: newStory._id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al crear', error: msg });
  }
};

export const updateStoryTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, initialText, imageUrl } = req.body;
    const updatedStory = await update(id, { title, description, initialText, imageUrl });
    if (!updatedStory) {
      res.status(404).json({ message: 'Historia no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Historia actualizada', story: updatedStory });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al actualizar', error: msg });
  }
};

export const startStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { templateId } = req.body;
    if (!templateId) {
      res.status(400).json({ message: 'Se requiere templateId' });
      return;
    }
    const user = (req as unknown as { user: { id: string } }).user;
    const result = await start(templateId, user.id);
    if (result.error) {
      res.status(result.status!).json({ message: result.error });
      return;
    }
    res.status(201).json({
      message: 'Historia iniciada correctamente',
      storyInstanceId: result.data!._id
    });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error al iniciar la historia' });
  }
};

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await list();
    res.json(stories);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error al obtener la lista' });
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deletedStory = await remove(id);
    if (!deletedStory) {
      res.status(404).json({ message: 'Historia no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Historia eliminada correctamente' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al eliminar', error: msg });
  }
};

export const getMyStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const u = (req as unknown as { user: { id: string } }).user;
    const stories = await myStories(u.id);
    res.json(stories);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error al obtener tus historias' });
  }
};

export const chatWithStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { userInput } = req.body;
    const result = await chat(id, userInput);
    if (result?.error) {
      res.status(result.status!).json({ message: result.error });
      return;
    }
    // No response sent — matches original incomplete behavior
  } catch (error: unknown) {
    // Empty catch — matches original storyController.js
  }
};
