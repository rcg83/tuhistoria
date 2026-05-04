import mongoose, { Schema } from 'mongoose';

export interface StoryInstance {
  user: mongoose.Types.ObjectId;
  template: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
  }[];
}

const storyInstanceSchema = new Schema<StoryInstance>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: Schema.Types.ObjectId,
    ref: 'StoryTemplate',
    required: true
  },
  messages: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

export const MongoStoryInstanceModel = mongoose.model<StoryInstance>('StoryInstance', storyInstanceSchema);
