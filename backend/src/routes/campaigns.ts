import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';

const router = Router();

router.get('/', CampaignController.getAllCampaigns);
router.get('/:id', CampaignController.getCampaignById);
router.post('/', CampaignController.createCampaign);
router.put('/:id', CampaignController.updateCampaign);
router.delete('/:id', CampaignController.deleteCampaign);

export default router;