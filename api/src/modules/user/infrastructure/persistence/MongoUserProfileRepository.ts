import { MongoUserProfileModel } from './MongoUserProfileModel.js';
import type { UserProfileRepository } from '../../domain/UserProfileRepository.js';
import type { UserProfile } from '../../domain/UserProfile.js';

export const mongoUserProfileRepository: UserProfileRepository = {
  async create(data: Partial<UserProfile>): Promise<Record<string, unknown>> {
    const doc = await MongoUserProfileModel.create(data);
    return doc.toObject();
  },

  async findByUserId(userId: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoUserProfileModel.findOne({ user: userId });
    return doc ? doc.toObject() : null;
  },

  async updateByUserId(userId: string, data: Partial<UserProfile>): Promise<Record<string, unknown> | null> {
    const doc = await MongoUserProfileModel.findOneAndUpdate(
      { user: userId },
      data,
      { new: true }
    );
    return doc ? doc.toObject() : null;
  },
};
