import { Router } from 'express';
import { AdController } from '../controllers/adController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createAdSchema, 
  updateAdSchema, 
  uuidParamSchema 
} from '../schemas';

const router = Router();

router.get('/', authenticateToken, AdController.getAllAds);
router.get('/:id', authenticateToken, validateParams(uuidParamSchema), AdController.getAdById);
router.post('/', authenticateToken, validateBody(createAdSchema), AdController.createAd);
router.put('/:id', authenticateToken, validateParams(uuidParamSchema), validateBody(updateAdSchema), AdController.updateAd);
router.delete('/:id', authenticateToken, validateParams(uuidParamSchema), AdController.deleteAd);

export default router;
