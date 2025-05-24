import { Router } from 'express';
import { AdSetController } from '../controllers/adsetController';
import { AdController } from '../controllers/adController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createAdSetSchema, 
  updateAdSetSchema, 
  uuidParamSchema, 
  adsetIdParamSchema 
} from '../schemas';

const router = Router();

router.get('/', authenticateToken, AdSetController.getAllAdSets);
router.get('/:id', authenticateToken, validateParams(uuidParamSchema), AdSetController.getAdSetById);
router.post('/', authenticateToken, validateBody(createAdSetSchema), AdSetController.createAdSet);
router.put('/:id', authenticateToken, validateParams(uuidParamSchema), validateBody(updateAdSetSchema), AdSetController.updateAdSet);
router.delete('/:id', authenticateToken, validateParams(uuidParamSchema), AdSetController.deleteAdSet);

// Nested routes for ads
router.get('/:adsetId/ads', authenticateToken, validateParams(adsetIdParamSchema), AdController.getAdsByAdSetId);

export default router;
