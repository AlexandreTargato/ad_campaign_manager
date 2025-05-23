import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, CampaignController.getAllCampaigns);
router.get('/:id', optionalAuth, CampaignController.getCampaignById);
router.post('/', authenticateToken, CampaignController.createCampaign);
router.put('/:id', authenticateToken, CampaignController.updateCampaign);
router.delete('/:id', authenticateToken, CampaignController.deleteCampaign);

export default router;