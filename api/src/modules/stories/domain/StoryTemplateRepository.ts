import type { StoryTemplate } from './StoryTemplate.js';

export interface StoryTemplateRepository {
  create(data: Partial<StoryTemplate>): Promise<Record<string, unknown>>;
  findById(id: string): Promise<Record<string, unknown> | null>;
  findAll(): Promise<Record<string, unknown>[]>;
  updateById(id: string, data: Partial<StoryTemplate>): Promise<Record<string, unknown> | null>;
  deleteById(id: string): Promise<Record<string, unknown> | null>;
}
