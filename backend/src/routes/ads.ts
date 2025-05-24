import { Router } from 'express';
import { AdController } from '../controllers/adController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, AdController.getAllAds);
router.get('/:id', authenticateToken, AdController.getAdById);
router.post('/', authenticateToken, AdController.createAd);
router.put('/:id', authenticateToken, AdController.updateAd);
router.delete('/:id', authenticateToken, AdController.deleteAd);

export default router;
