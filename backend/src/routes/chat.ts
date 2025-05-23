import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, ChatController.handleChatMessage);
router.delete('/context', authenticateToken, ChatController.clearChatContext);

export default router;