import mongoose from 'mongoose';
import storyMessageSchema from './StoryMessage.js';

const storyInstanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'StoryTemplate', required: true },
  messages: [storyMessageSchema]
});

export default mongoose.model('StoryInstance', storyInstanceSchema);