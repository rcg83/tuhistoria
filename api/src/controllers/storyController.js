import StoryTemplate from '../schemes/StoryTemplate.js';
import StoryInstance from '../schemes/StoryInstance.js';

export const createStoryTemplate = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const newStory = await StoryTemplate.create({ title, content });
    res.status(201).json({
      message: 'Historia creada correctamente',
      storyId: newStory._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la historia' });
  }
};

export const startStory = async (req, res) => {
  try {
    const { templateId } = req.body;
    if (!templateId) {
      return res.status(400).json({ message: 'Se requiere templateId' });
    }

    const template = await StoryTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template de la historia no encontrado' });
    }

    const storyInstance = await StoryInstance.create({
      template: template._id,
      user: req.user.id,
      messages: []
    });

    res.status(201).json({
      message: 'Historia iniciada correctamente',
      storyInstanceId: storyInstance._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar la historia' });
  }
}