import { Request, Response } from 'express';
import { AdSetModel, CreateAdSetRequest } from '../models/AdSet';

export class AdSetController {
  static async getAllAdSets(req: Request, res: Response) {
    try {
      const adsets = await AdSetModel.getAll();
      res.json(adsets);
    } catch (error) {
      console.error('Error fetching adsets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAdSetsByCampaignId(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;
      const adsets = await AdSetModel.getByCampaignId(campaignId);
      res.json(adsets);
    } catch (error) {
      console.error('Error fetching adsets by campaign:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAdSetById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adset = await AdSetModel.getById(id);

      if (!adset) {
        return res.status(404).json({ error: 'AdSet not found' });
      }

      res.json(adset);
    } catch (error) {
      console.error('Error fetching adset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createAdSet(req: Request, res: Response) {
    try {
      const adsetData: CreateAdSetRequest = req.body;

      // Basic validation
      if (
        !adsetData.name ||
        !adsetData.campaign_id ||
        typeof adsetData.daily_budget !== 'number'
      ) {
        return res.status(400).json({
          error: 'AdSet name, campaign_id, and daily_budget are required',
        });
      }

      if (adsetData.daily_budget <= 0) {
        return res.status(400).json({
          error: 'Daily budget must be greater than 0',
        });
      }

      const adset = await AdSetModel.create(adsetData);
      res.status(201).json(adset);
    } catch (error) {
      console.error('Error creating adset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateAdSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate daily_budget if provided
      if (
        updates.daily_budget !== undefined &&
        (typeof updates.daily_budget !== 'number' || updates.daily_budget <= 0)
      ) {
        return res.status(400).json({
          error: 'Daily budget must be a positive number',
        });
      }

      const adset = await AdSetModel.update(id, updates);

      if (!adset) {
        return res.status(404).json({ error: 'AdSet not found' });
      }

      res.json(adset);
    } catch (error) {
      console.error('Error updating adset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAdSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await AdSetModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'AdSet not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting adset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
