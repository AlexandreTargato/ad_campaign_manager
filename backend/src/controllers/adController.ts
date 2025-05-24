import { Request, Response } from 'express';
import { AdModel, CreateAdRequest } from '../models/Ad';

export class AdController {
  static async getAllAds(req: Request, res: Response) {
    try {
      const ads = await AdModel.getAll();
      res.json(ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAdsByAdSetId(req: Request, res: Response) {
    try {
      const { adsetId } = req.params;
      const ads = await AdModel.getByAdSetId(adsetId);
      res.json(ads);
    } catch (error) {
      console.error('Error fetching ads by adset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAdById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ad = await AdModel.getById(id);

      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      res.json(ad);
    } catch (error) {
      console.error('Error fetching ad:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createAd(req: Request, res: Response) {
    try {
      const adData: CreateAdRequest = req.body;

      // Basic validation
      if (!adData.name || !adData.adset_id || !adData.creative_id) {
        return res.status(400).json({
          error: 'Ad name, adset_id, and creative_id are required',
        });
      }

      // Validate status if provided
      if (adData.status && !['ACTIVE', 'PAUSED'].includes(adData.status)) {
        return res.status(400).json({
          error: 'Status must be either ACTIVE or PAUSED',
        });
      }

      const ad = await AdModel.create(adData);
      res.status(201).json(ad);
    } catch (error) {
      console.error('Error creating ad:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateAd(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate status if provided
      if (updates.status && !['ACTIVE', 'PAUSED'].includes(updates.status)) {
        return res.status(400).json({
          error: 'Status must be either ACTIVE or PAUSED',
        });
      }

      const ad = await AdModel.update(id, updates);

      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      res.json(ad);
    } catch (error) {
      console.error('Error updating ad:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAd(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await AdModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting ad:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
