import type { StoryTemplate } from './StoryTemplate.js';

export interface StoryTemplateRepository {
  create(data: Partial<StoryTemplate>): Promise<StoryTemplate>;
  findById(id: string): Promise<StoryTemplate | null>;
  findAll(): Promise<StoryTemplate[]>;
  updateById(id: string, data: Partial<StoryTemplate>): Promise<StoryTemplate | null>;
  deleteById(id: string): Promise<StoryTemplate | null>;
}
