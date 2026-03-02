import express from 'express';
import { createStoryTemplate, startStory, getStories } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createStoryTemplate);
router.post('/start', protect, startStory);

/* RUTAS PROTEGIDAS a nivel rol "admin" */
router.get('/', protect, authorize('admin'), getStories);

export default router;