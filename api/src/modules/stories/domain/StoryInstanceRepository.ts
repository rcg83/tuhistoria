import type { StoryInstance } from './StoryInstance.js';

export interface StoryInstanceRepository {
  create(data: Partial<StoryInstance>): Promise<StoryInstance>;
  findById(id: string): Promise<StoryInstance | null>;
  findByUser(userId: string): Promise<StoryInstance[]>;
  pushMessage(id: string, message: { role: 'user' | 'model'; text: string; timestamp?: Date }): Promise<void>;
  updateSummary(id: string, summary: string): Promise<void>;
}
