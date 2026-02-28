import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
});

export default mongoose.model('Historia', storySchema);