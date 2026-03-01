import express from 'express';
import { createStoryTemplate, startStory } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createStoryTemplate);
router.post('/start', protect, startStory);

export default router;