import { mongoStoryTemplateRepository } from '../modules/stories/infrastructure/persistence/MongoStoryTemplateRepository.js';
import { mongoStoryInstanceRepository } from '../modules/stories/infrastructure/persistence/MongoStoryInstanceRepository.js';
import { geminiAiService } from '../modules/stories/infrastructure/services/GeminiAiService.js';
import {
  createStoryTemplateUseCase,
  updateStoryTemplateByIdUseCase,
  getStoriesUseCase,
  deleteStoryUseCase,
} from '../modules/stories/application/StoryTemplateUseCases.js';
import {
  startStoryUseCase,
  getMyStoriesUseCase,
  chatWithStoryUseCase,
  getStoryUseCase,
} from '../modules/stories/application/StoryInstanceUseCases.js';
import {
  createStoryTemplate as createHandler,
  updateStoryTemplateById as updateHandler,
  getStories as listHandler,
  deleteStory as deleteHandler,
  startStory as startHandler,
  getMyStories as myStoriesHandler,
  chatWithStory as chatHandler,
  getStory as getHandler,
} from '../modules/stories/infrastructure/http/StoryController.js';

const templateRepo = mongoStoryTemplateRepository;
const instanceRepo = mongoStoryInstanceRepository;
const aiService = geminiAiService;

export const createStoryTemplate = createHandler(createStoryTemplateUseCase(templateRepo));
export const updateStoryTemplateById = updateHandler(updateStoryTemplateByIdUseCase(templateRepo));
export const getStories = listHandler(getStoriesUseCase(templateRepo));
export const deleteStory = deleteHandler(deleteStoryUseCase(templateRepo));
export const startStory = startHandler(startStoryUseCase(instanceRepo, templateRepo, aiService));
export const getMyStories = myStoriesHandler(getMyStoriesUseCase(instanceRepo));
export const chatWithStory = chatHandler(chatWithStoryUseCase(instanceRepo, aiService));
export const getStory = getHandler(getStoryUseCase(instanceRepo));
