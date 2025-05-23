import pool from '../database/connection';
import { Campaign, CreateCampaignRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CampaignModel {
  static async getAll(): Promise<Campaign[]> {
    const result = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id: string): Promise<Campaign | null> {
    const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(campaignData: CreateCampaignRequest): Promise<Campaign> {
    const id = uuidv4();
    const stopTime = campaignData.stop_time || Date.now() + (30 * 24 * 60 * 60 * 1000); // Default to 30 days from now
    
    const result = await pool.query(
      'INSERT INTO campaigns (id, name, objective, status, stop_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, campaignData.name, campaignData.objective, 'ACTIVE', stopTime]
    );
    
    return result.rows[0];
  }

  static async update(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    
    const result = await pool.query(
      `UPDATE campaigns SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM campaigns WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}