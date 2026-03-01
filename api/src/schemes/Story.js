import mongoose from 'mongoose';

const storyTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  initialText: { type: String, required: true },
  imageUrl: String
});

export default mongoose.model('StoryTemplate', storyTemplateSchema);