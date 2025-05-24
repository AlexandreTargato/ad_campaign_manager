import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';
import { AdSetController } from '../controllers/adsetController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, CampaignController.getAllCampaigns);
router.get('/:id', optionalAuth, CampaignController.getCampaignById);
router.post('/', authenticateToken, CampaignController.createCampaign);
router.put('/:id', authenticateToken, CampaignController.updateCampaign);
router.delete('/:id', authenticateToken, CampaignController.deleteCampaign);

// Nested routes for adsets
router.get(
  '/:campaignId/adsets',
  authenticateToken,
  AdSetController.getAdSetsByCampaignId
);

export default router;
