import { Request, Response } from 'express';
import { CampaignModel } from '../models/Campaign';
import { CreateCampaignRequest } from '../types';

export class CampaignController {
  static async getAllCampaigns(req: Request, res: Response) {
    try {
      // If user is authenticated, only return their campaigns
      const userId = req.user?.id;
      const campaigns = await CampaignModel.getAll(userId);
      res.json(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getCampaignById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const campaign = await CampaignModel.getById(id);

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      res.json(campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createCampaign(req: Request, res: Response) {
    try {
      const campaignData: CreateCampaignRequest = req.body;

      // Add user_id from authenticated user
      if (req.user) {
        campaignData.user_id = req.user.id;
      } else {
        return res.status(401).json({
          error: 'Authentication required to create campaigns',
        });
      }

      const campaign = await CampaignModel.create(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const campaign = await CampaignModel.update(id, updates);

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      res.json(campaign);
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CampaignModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
