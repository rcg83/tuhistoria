import { Router, Request, Response } from 'express';
import { createStoryTemplate, startStory, getStories, deleteStory, chatWithStory, updateStoryTemplateById, getMyStories } from '../modules/stories/infrastructure/http/StoryController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

import { testGemini, continueStory } from '../services/geminiService.js';

const router: Router = Router();

router.get('/', protect, getStories);
router.get('/my-stories', protect, getMyStories);
router.post('/start', protect, startStory);
router.post('/:id/chat', protect, chatWithStory);

router.post('/', protect, authorize('admin'), createStoryTemplate);
router.put('/:id', protect, authorize('admin'), updateStoryTemplateById);
router.delete('/delete/:id', protect, authorize('admin'), deleteStory);

router.get('/test-ai', async (req: Request, res: Response) => {
  try {
    const respuesta = await testGemini("Cuéntame algo interesante con una frase breve y al azar.");
    res.json({
      status: "Conexión con Gemini establecida",
      respuesta
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: "Error en el SDK de Google",
      mensaje: message
    });
  }
});

router.post('/test-chat', async (req: Request, res: Response) => {
  try {
    const { history, userInput } = req.body;
    const respuesta = await continueStory(history, userInput);
    res.json({ respuesta });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
