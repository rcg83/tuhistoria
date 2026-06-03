import { Router } from 'express';
import { registerUser, loginUser } from '../modules/auth/infrastructure/http/AuthController.js';
import { getUserAccount, getUserProfile, getUsers, deleteUser, updateMyProfile, updateMyAccount, updateUserRole, adminUpdateUser } from '../modules/user/infrastructure/http/UserController.js';
import { protect, authorize } from '../middlewares/authMiddlewares.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/account', protect, getUserAccount);
router.get('/profile', protect, getUserProfile);
router.put('/profile/edit', protect, updateMyProfile);
router.put('/account/edit', protect, updateMyAccount);

router.get('/', protect, authorize('admin'), getUsers);
router.put('/role/:id', protect, authorize('admin'), updateUserRole);
router.put('/admin/:id', protect, authorize('admin'), adminUpdateUser);
router.delete('/delete/:id', protect, authorize('admin'), deleteUser);

export default router;
