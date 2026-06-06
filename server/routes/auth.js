import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;