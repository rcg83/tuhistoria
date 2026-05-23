import mongoose, { Schema } from 'mongoose';

export interface MongoUserProfileDocument {
  user: mongoose.Types.ObjectId;
  bio: string;
  avatarUrl: string;
  location: string;
}

const profileSchema = new Schema<MongoUserProfileDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  location: { type: String, default: '' },
}, { timestamps: true });

export const MongoUserProfileModel = mongoose.model<MongoUserProfileDocument>('Profile', profileSchema);
