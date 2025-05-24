import pool from '../database/connection';
import { Campaign, CreateCampaignRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CampaignModel {
  static async getAll(userId?: string): Promise<Campaign[]> {
    if (userId) {
      const result = await pool.query(
        'SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } else {
      const result = await pool.query(
        'SELECT * FROM campaigns ORDER BY created_at DESC'
      );
      return result.rows;
    }
  }

  static async getById(id: string): Promise<Campaign | null> {
    const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async create(campaignData: CreateCampaignRequest): Promise<Campaign> {
    const id = uuidv4();
    const stopTime = campaignData.stop_time
      ? new Date(campaignData.stop_time * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (!campaignData.user_id) {
      throw new Error('User ID is required to create a campaign');
    }

    const result = await pool.query(
      'INSERT INTO campaigns (id, name, objective, status, stop_time, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        id,
        campaignData.name,
        campaignData.objective,
        'ACTIVE',
        stopTime,
        campaignData.user_id,
      ]
    );

    return result.rows[0];
  }

  static async update(
    id: string,
    updates: Partial<Campaign>
  ): Promise<Campaign | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE campaigns SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM campaigns WHERE id = $1', [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}
