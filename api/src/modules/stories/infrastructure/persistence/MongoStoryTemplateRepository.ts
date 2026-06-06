import { MongoStoryTemplateModel } from './MongoStoryTemplateModel.js';
import type { StoryTemplateRepository } from '../../domain/StoryTemplateRepository.js';
import type { StoryTemplate } from '../../domain/StoryTemplate.js';

function toTemplate(doc: Record<string, unknown>): StoryTemplate {
  return {
    _id: (doc._id as { toString(): string }).toString(),
    title: doc.title as string,
    description: doc.description as string,
    initialText: doc.initialText as string,
    imageUrl: doc.imageUrl as string | undefined,
    events: doc.events as { messageNumber: number; prompt: string }[] | undefined,
  };
}

export const mongoStoryTemplateRepository: StoryTemplateRepository = {
  async create(data: Partial<StoryTemplate>): Promise<StoryTemplate> {
    const doc = await MongoStoryTemplateModel.create(data);
    return toTemplate(doc.toObject());
  },

  async findById(id: string): Promise<StoryTemplate | null> {
    const doc = await MongoStoryTemplateModel.findById(id);
    return doc ? toTemplate(doc.toObject()) : null;
  },

  async findAll(): Promise<StoryTemplate[]> {
    const docs = await MongoStoryTemplateModel.find();
    return docs.map(d => toTemplate(d.toObject()));
  },

  async updateById(id: string, data: Partial<StoryTemplate>): Promise<StoryTemplate | null> {
    const doc = await MongoStoryTemplateModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? toTemplate(doc.toObject()) : null;
  },

  async deleteById(id: string): Promise<StoryTemplate | null> {
    const doc = await MongoStoryTemplateModel.findByIdAndDelete(id);
    return doc ? toTemplate(doc.toObject()) : null;
  }
};
