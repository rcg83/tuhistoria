import express from 'express';
import { createStoryTemplate, startStory, getStories } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

import { testGemini } from '../services/geminiService.js';


const router = express.Router();

router.post('/', protect, authorize('admin'), createStoryTemplate);
router.post('/start', protect, startStory);

/* RUTAS PROTEGIDAS a nivel rol "admin" */
router.get('/', protect, authorize('admin'), getStories);



router.get('/test-ai', async (req, res) => {
  try {

    const respuesta = await testGemini("Responde con algo breve e interesante sobre programación.!'");
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