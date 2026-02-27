import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Ruta: POST /api/users/register
router.post('/register', registerUser);

// Ruta: POST /api/users/login
router.post('/login', loginUser);

/* RUTAS PROTEGIDAS */
/* El middleware 'protect' se ejecuta ANTES que 'getUserProfile'. */
router.get('/profile', protect, getUserProfile);

export default router;