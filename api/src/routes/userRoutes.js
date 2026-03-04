import express from 'express';
import { registerUser, loginUser, getUserAccount, getUserProfile, getUsers, deleteUser, updateMyProfile } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

/* RUTAS PÚBLICAS */
router.post('/register', registerUser);
router.post('/login', loginUser);

/* RUTAS PROTEGIDAS a nivel rol "user" */
router.get('/account', protect, getUserAccount);
router.get('/profile', protect, getUserProfile);
router.put('/profile/edit', protect, updateMyProfile);

/* RUTAS PROTEGIDAS a nivel rol "admin" */
router.get('/', protect, authorize('admin'), getUsers);
router.delete('/delete/:id', protect, authorize('admin'), deleteUser);

export default router;