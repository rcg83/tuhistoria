import type { UserProfile } from './UserProfile.js';

export interface UserProfileRepository {
  create(data: Partial<UserProfile>): Promise<Record<string, unknown>>;
  findByUserId(userId: string): Promise<Record<string, unknown> | null>;
  updateByUserId(userId: string, data: Partial<UserProfile>): Promise<Record<string, unknown> | null>;
}
