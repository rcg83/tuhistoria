import { MongoUserModel } from './MongoUserModel.js';
import type { UserRepository } from '../../domain/UserRepository.js';
import type { User } from '../../domain/User.js';

export const mongoUserRepository: UserRepository = {
  async create(data: Partial<User>): Promise<Record<string, unknown>> {
    const doc = await MongoUserModel.create(data);
    return doc.toObject();
  },

  async findById(id: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoUserModel.findById(id).select('-password');
    return doc ? doc.toObject() : null;
  },

  async findByEmail(email: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoUserModel.findOne({ email });
    return doc ? doc.toObject() : null;
  },

  async findAll(): Promise<Record<string, unknown>[]> {
    const docs = await MongoUserModel.find().select('-password');
    return docs.map(d => d.toObject());
  },

  async updateById(id: string, data: Partial<User>): Promise<Record<string, unknown> | null> {
    const doc = await MongoUserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
    return doc ? doc.toObject() : null;
  },

  async deleteById(id: string): Promise<Record<string, unknown> | null> {
    const doc = await MongoUserModel.findByIdAndDelete(id);
    return doc ? doc.toObject() : null;
  },
};
