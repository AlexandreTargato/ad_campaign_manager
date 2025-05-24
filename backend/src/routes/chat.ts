import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { chatRequestSchema } from '../schemas';

const router = Router();

router.post('/', authenticateToken, validateBody(chatRequestSchema), ChatController.handleChatMessage);
router.delete('/context', authenticateToken, ChatController.clearChatContext);

export default router;
