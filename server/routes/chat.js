import { Router } from 'express';
import { handleChat, getChats, getChatById, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);
router.post('/', handleChat);
router.get('/', getChats);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);

export default router;