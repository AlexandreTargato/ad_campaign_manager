import pool from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  creative_id: string;
  status: 'PAUSED' | 'ACTIVE';
}

export interface CreateAdRequest {
  name: string;
  adset_id: string;
  creative_id: string;
  status?: 'PAUSED' | 'ACTIVE';
}

export class AdModel {
  static async getAll(): Promise<Ad[]> {
    const result = await pool.query('SELECT * FROM ads ORDER BY name');
    return result.rows;
  }

  static async getByAdSetId(adsetId: string): Promise<Ad[]> {
    const result = await pool.query(
      'SELECT * FROM ads WHERE adset_id = $1 ORDER BY name',
      [adsetId]
    );
    return result.rows;
  }

  static async getById(id: string): Promise<Ad | null> {
    const result = await pool.query('SELECT * FROM ads WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(adData: CreateAdRequest): Promise<Ad> {
    const id = uuidv4();
    const status = adData.status || 'ACTIVE';

    const result = await pool.query(
      'INSERT INTO ads (id, name, adset_id, creative_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, adData.name, adData.adset_id, adData.creative_id, status]
    );

    return result.rows[0];
  }

  static async update(
    id: string,
    updates: Partial<Omit<Ad, 'id'>>
  ): Promise<Ad | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE ads SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM ads WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async deleteAllByAdSetId(adsetId: string): Promise<number> {
    const result = await pool.query('DELETE FROM ads WHERE adset_id = $1', [
      adsetId,
    ]);
    return result.rowCount ?? 0;
  }

  static async deleteAllByCampaignId(campaignId: string): Promise<number> {
    const result = await pool.query(
      `
      DELETE FROM ads 
      WHERE adset_id IN (
        SELECT id FROM adsets WHERE campaign_id = $1
      )
    `,
      [campaignId]
    );
    return result.rowCount ?? 0;
  }
}
