import mongoose from 'mongoose';

const storyTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  initialText: { type: String, required: true },
  imageUrl: String,
  events: [{
    messageNumber: { type: Number, required: true },
    prompt: { type: String, required: true }
  }]
});

export const MongoStoryTemplateModel = mongoose.model('StoryTemplate', storyTemplateSchema);
