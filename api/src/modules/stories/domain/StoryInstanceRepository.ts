export interface StoryInstanceRepository {
  create(data: Partial<Record<string, unknown>>): Promise<Record<string, unknown>>;
  findById(id: string): Promise<Record<string, unknown> | null>;
  findByUser(userId: string): Promise<Record<string, unknown>[]>;
  pushMessage(id: string, message: { role: 'user' | 'model'; text: string; timestamp?: Date }): Promise<void>;
  updateSummary(id: string, summary: string): Promise<void>;
}
