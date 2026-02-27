import express from 'express';
import { registerUser, loginUser, getUserProfile, getUsers } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

/* RUTAS PÚBLICAS */

// Ruta: GET /api/users/
router.get('/', protect, authorize('admin'), getUsers);
// El middleware "authorize" solo deja acceso a rol "admin".

// Ruta: POST /api/users/register
router.post('/register', registerUser);

// Ruta: POST /api/users/login
router.post('/login', loginUser);

/* RUTAS PROTEGIDAS */

/* El middleware 'protect' se ejecuta ANTES que 'getUserProfile'. */
router.get('/profile', protect, getUserProfile);



export default router;