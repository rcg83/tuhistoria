import StoryTemplate from '../schemes/StoryTemplate.js';
import StoryInstance from '../schemes/StoryInstance.js';

export const createStoryTemplate = async (req, res) => {
  try {
    const { title, description, initialText, imageUrl } = req.body;

    const newStory = await StoryTemplate.create({
      title,
      description,
      initialText,
      imageUrl
    });

    res.status(201).json({ message: 'Historia creada', storyId: newStory._id });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear', error: error.message });
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

/* Devuelve todas las historias generadas */
export const getStories = async (req, res) => {
  try {
    const stories = await StoryInstance.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
}

export const chatWithStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userInput } = req.body;

    // 1. Recuperamos la instancia de la historia de la base de datos.
    const story = await StoryInstance.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Historia no encontrada' });
    }

    // 2. Convertimos los mensajes al formato que espera el modelo.
    const history = story.messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const aiResponse = await continueStory(history, userInput);

  } catch (error) {

  }
}