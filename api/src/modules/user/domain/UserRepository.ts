import type { User } from './User.js';

export interface UserRepository {
  create(data: Partial<User>): Promise<Record<string, unknown>>;
  findById(id: string): Promise<Record<string, unknown> | null>;
  findByEmail(email: string): Promise<Record<string, unknown> | null>;
  findAll(): Promise<Record<string, unknown>[]>;
  deleteById(id: string): Promise<Record<string, unknown> | null>;
}
