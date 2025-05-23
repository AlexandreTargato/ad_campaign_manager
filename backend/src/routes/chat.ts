import { Router } from 'express';
import { ChatController } from '../controllers/chatController';

const router = Router();

router.post('/', ChatController.handleChatMessage);
router.delete('/context', ChatController.clearChatContext);

export default router;