import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';
import { AdSetController } from '../controllers/adsetController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createCampaignSchema, 
  updateCampaignSchema, 
  uuidParamSchema, 
  campaignIdParamSchema 
} from '../schemas';

const router = Router();

router.get('/', optionalAuth, CampaignController.getAllCampaigns);
router.get('/:id', optionalAuth, validateParams(uuidParamSchema), CampaignController.getCampaignById);
router.post('/', authenticateToken, validateBody(createCampaignSchema), CampaignController.createCampaign);
router.put('/:id', authenticateToken, validateParams(uuidParamSchema), validateBody(updateCampaignSchema), CampaignController.updateCampaign);
router.delete('/:id', authenticateToken, validateParams(uuidParamSchema), CampaignController.deleteCampaign);

// Nested routes for adsets
router.get(
  '/:campaignId/adsets',
  authenticateToken,
  validateParams(campaignIdParamSchema),
  AdSetController.getAdSetsByCampaignId
);

export default router;
