import Story from '../schemes/Story.js';

export const createStoryTemplate = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const newStory = await Story.create({ title, content });
    res.status(201).json({
      message: 'Historia creada correctamente',
      storyId: newStory._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la historia' });
  }
};