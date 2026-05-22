export interface StoryInstanceRepository {
  create(data: Partial<Record<string, unknown>>): Promise<Record<string, unknown>>;
  findById(id: string): Promise<Record<string, unknown> | null>;
  findByUser(userId: string): Promise<Record<string, unknown>[]>;
}
