import express from 'express';
import { registerUser, loginUser, getUserProfile, getUsers } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

/* RUTAS PÚBLICAS */
router.post('/register', registerUser);
router.post('/login', loginUser);

/* RUTAS PROTEGIDAS */
router.get('/', protect, authorize('admin'), getUsers);
router.get('/profile', protect, getUserProfile);

export default router;