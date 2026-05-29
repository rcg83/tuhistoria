import { MongoStoryTemplateModel } from './MongoStoryTemplateModel.js';
import type { StoryTemplateRepository } from '../../domain/StoryTemplateRepository.js';
import type { StoryTemplate } from '../../domain/StoryTemplate.js';

export const mongoStoryTemplateRepository: StoryTemplateRepository = {
  async create(data: Partial<StoryTemplate>): Promise<Record<string, unknown>> {
    const doc = await MongoStoryTemplateModel.create(data);
    return doc.toObject();
  },

  async findById(id: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoStoryTemplateModel.findById(id);
    return doc ? doc.toObject() : null;
  },

  async findAll(): Promise<Record<string, unknown>[]> {
    const docs = await MongoStoryTemplateModel.find();
    return docs.map(d => d.toObject());
  },

  async updateById(id: string, data: Partial<StoryTemplate>): Promise<Record<string, unknown> | null> {
    const doc = await MongoStoryTemplateModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? doc.toObject() : null;
  },

  async deleteById(id: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoStoryTemplateModel.findByIdAndDelete(id);
    return doc ? doc.toObject() : null;
  }
};
