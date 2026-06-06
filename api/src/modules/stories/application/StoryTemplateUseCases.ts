import type { StoryTemplateRepository } from '../domain/StoryTemplateRepository.js';
import type { StoryTemplate } from '../domain/StoryTemplate.js';

export const createStoryTemplateUseCase = (repo: StoryTemplateRepository) => {
  return async (data: Partial<StoryTemplate>): Promise<StoryTemplate> => {
    return repo.create(data);
  };
};

export const updateStoryTemplateByIdUseCase = (repo: StoryTemplateRepository) => {
  return async (id: string, data: Partial<StoryTemplate>): Promise<StoryTemplate | null> => {
    return repo.updateById(id, data);
  };
};

export const getStoriesUseCase = (repo: StoryTemplateRepository) => {
  return async (): Promise<StoryTemplate[]> => {
    return repo.findAll();
  };
};

export const deleteStoryUseCase = (repo: StoryTemplateRepository) => {
  return async (id: string): Promise<StoryTemplate | null> => {
    return repo.deleteById(id);
  };
};
