import express from 'express';
import { createStoryTemplate } from '../controllers/storyController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createStoryTemplate);

export default router;