import { Router } from 'express';
import { login, logout, register, verifyUser } from '../controllers/auth';
import { protect } from '../middleware/auth-middleware';

export const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', protect, verifyUser);
