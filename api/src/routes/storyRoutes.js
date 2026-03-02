import express from 'express';
import { createStoryTemplate, startStory, getStories, chatWithStory } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

import { testGemini } from '../services/geminiService.js';


const router = express.Router();

/* RUTAS PROTEGIDAS a nivel rol "user" */
router.post('/start', protect, startStory);
router.post('/:id/chat', protect, chatWithStory);

/* RUTAS PROTEGIDAS a nivel rol "admin" */
router.post('/', protect, authorize('admin'), createStoryTemplate);
router.get('/', protect, authorize('admin'), getStories);



router.get('/test-ai', async (req, res) => {
  try {
    const respuesta = await testGemini("Dime qué hay en tu memoria sobre peticiones anteriores. Si no tienes nada dime cómo hacer que tengas memoria.");
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


export default router;