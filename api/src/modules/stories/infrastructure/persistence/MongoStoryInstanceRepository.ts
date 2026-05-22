import { MongoStoryInstanceModel } from './StoryInstance.js';
import type { StoryInstanceRepository } from '../../domain/StoryInstanceRepository.js';

export const mongoStoryInstanceRepository: StoryInstanceRepository = {
  async create(data: Partial<Record<string, unknown>>): Promise<Record<string, unknown>> {
    const doc = await MongoStoryInstanceModel.create(data);
    return doc.toObject();
  },

  async findById(id: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoStoryInstanceModel.findById(id);
    return doc ? doc.toObject() : null;
  },

  async findByUser(userId: string): Promise<Record<string, unknown>[]> {
    const docs = await MongoStoryInstanceModel.find({ user: userId })
      .populate('template')
      .sort({ _id: -1 });
    return docs.map(d => d.toObject());
  }
};
