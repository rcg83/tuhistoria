import mongoose from 'mongoose';

export interface MongoUserDocument {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const userSchema = new mongoose.Schema<MongoUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

export const MongoUserModel = mongoose.model<MongoUserDocument>('User', userSchema);
