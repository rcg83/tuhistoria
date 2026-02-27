import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Ruta: POST /api/users/register
router.post('/register', registerUser);

// Ruta: POST /api/users/login
router.post('/login', loginUser);

export default router;