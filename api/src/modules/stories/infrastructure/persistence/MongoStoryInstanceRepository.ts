import { MongoStoryInstanceModel } from './MongoStoryInstanceModel.js';
import type { StoryInstanceRepository } from '../../domain/StoryInstanceRepository.js';
import type { StoryInstance } from '../../domain/StoryInstance.js';

function toInstance(doc: Record<string, unknown>): StoryInstance {
  return {
    _id: (doc._id as { toString(): string }).toString(),
    user: ((doc.user as { toString(): string })?.toString?.() ?? doc.user) as string,
    template: doc.template as string | Record<string, unknown>,
    messages: doc.messages as { role: 'user' | 'model'; text: string; timestamp: Date }[],
    summary: doc.summary as string | undefined,
    createdAt: doc.createdAt as Date | undefined,
  };
}

export const mongoStoryInstanceRepository: StoryInstanceRepository = {
  async create(data: Partial<StoryInstance>): Promise<StoryInstance> {
    const doc = await MongoStoryInstanceModel.create(data);
    return toInstance(doc.toObject());
  },

  async findById(id: string): Promise<StoryInstance | null> {
    const doc = await MongoStoryInstanceModel.findById(id)
      .populate('template');
    return doc ? toInstance(doc.toObject()) : null;
  },

  async findByUser(userId: string): Promise<StoryInstance[]> {
    const docs = await MongoStoryInstanceModel.find({ user: userId })
      .populate('template')
      .sort({ _id: -1 });
    return docs.map(d => toInstance(d.toObject()));
  },

  async pushMessage(id: string, message: { role: 'user' | 'model'; text: string }): Promise<void> {
    await MongoStoryInstanceModel.findByIdAndUpdate(id, {
      $push: { messages: message }
    });
  },

  async updateSummary(id: string, summary: string): Promise<void> {
    await MongoStoryInstanceModel.findByIdAndUpdate(id, { summary });
  }
};
