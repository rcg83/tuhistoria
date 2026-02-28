import express from 'express';
import { createStory } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createStory);

export default router;