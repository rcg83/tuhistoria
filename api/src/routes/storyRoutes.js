import express from 'express';
import { createStoryTemplate, startStory, getStories, deleteStory, chatWithStory, updateStoryTemplateById, getMyStories } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

import { testGemini, continueStory } from '../services/geminiService.js';


const router = express.Router();

/* RUTAS PROTEGIDAS a nivel rol "user" */
router.get('/', protect, getStories);
router.get('/my-stories', protect, getMyStories);
router.post('/start', protect, startStory);
router.post('/:id/chat', protect, chatWithStory);

/* RUTAS PROTEGIDAS a nivel rol "admin" */
router.post('/', protect, authorize('admin'), createStoryTemplate);
router.put('/:id', protect, authorize('admin'), updateStoryTemplateById);
router.delete('/delete/:id', protect, authorize('admin'), deleteStory);

/* Función solo para probar que esté funcionando la API de IA. */
router.get('/test-ai', async (req, res) => {
  try {
    const respuesta = await testGemini("Cuéntame algo interesante con una frase breve y al azar.");
    res.json({ 
      status: "Conexión con Gemini establecida",
      respuesta
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Error en el SDK de Google", 
      mensaje: error.message 
    });
  }
});

router.post('/test-chat', async (req, res) => {
  try {
    const { history, userInput } = req.body;
    const respuesta = await continueStory(history, userInput);
    res.json({ respuesta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;