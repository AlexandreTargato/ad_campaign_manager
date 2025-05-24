import pool from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { AdSet } from '../types';

export interface CreateAdSetRequest {
  name: string;
  campaign_id: string;
  daily_budget: number;
}

export class AdSetModel {
  static async getAll(): Promise<AdSet[]> {
    const result = await pool.query('SELECT * FROM adsets ORDER BY name');
    return result.rows;
  }

  static async getByCampaignId(campaignId: string): Promise<AdSet[]> {
    const result = await pool.query(
      'SELECT * FROM adsets WHERE campaign_id = $1 ORDER BY name',
      [campaignId]
    );
    return result.rows;
  }

  static async getById(id: string): Promise<AdSet | null> {
    const result = await pool.query('SELECT * FROM adsets WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(adsetData: CreateAdSetRequest): Promise<AdSet> {
    const id = uuidv4();

    const result = await pool.query(
      'INSERT INTO adsets (id, name, campaign_id, daily_budget) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, adsetData.name, adsetData.campaign_id, adsetData.daily_budget]
    );

    return result.rows[0];
  }

  static async update(
    id: string,
    updates: Partial<Omit<AdSet, 'id'>>
  ): Promise<AdSet | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE adsets SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM adsets WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async deleteAllByCampaignId(campaignId: string): Promise<number> {
    const result = await pool.query(
      'DELETE FROM adsets WHERE campaign_id = $1',
      [campaignId]
    );
    return result.rowCount ?? 0;
  }
}
