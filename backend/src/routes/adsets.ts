import { Router } from 'express';
import { AdSetController } from '../controllers/adsetController';
import { AdController } from '../controllers/adController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, AdSetController.getAllAdSets);
router.get('/:id', authenticateToken, AdSetController.getAdSetById);
router.post('/', authenticateToken, AdSetController.createAdSet);
router.put('/:id', authenticateToken, AdSetController.updateAdSet);
router.delete('/:id', authenticateToken, AdSetController.deleteAdSet);

// Nested routes for ads
router.get('/:adsetId/ads', authenticateToken, AdController.getAdsByAdSetId);

export default router;
