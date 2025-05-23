// __tests__/models/CampaignModel.test.ts

const mockQuery = jest.fn();

jest.mock('../../database/connection', () => ({
  __esModule: true,
  default: {
    query: mockQuery,
  },
}));

import { CampaignModel } from '../../models/Campaign';

describe('CampaignModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all campaigns', async () => {
      const mockCampaigns = [
        {
          id: 'test-1',
          name: 'Test Campaign 1',
          objective: 'OUTCOME_TRAFFIC',
          status: 'ACTIVE',
          stop_time: Date.now(),
          created_at: new Date(),
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockCampaigns });

      const result = await CampaignModel.getAll();

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM campaigns ORDER BY created_at DESC'
      );
      expect(result).toEqual(mockCampaigns);
    });
  });

  describe('getById', () => {
    it('should return a campaign by id', async () => {
      const mockCampaign = {
        id: 'test-1',
        name: 'Test Campaign',
        objective: 'OUTCOME_TRAFFIC',
        status: 'ACTIVE',
        stop_time: Date.now(),
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockCampaign] });

      const result = await CampaignModel.getById('test-1');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM campaigns WHERE id = $1',
        ['test-1']
      );
      expect(result).toEqual(mockCampaign);
    });

    it('should return null if campaign not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await CampaignModel.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new campaign', async () => {
      const campaignData = {
        name: 'New Campaign',
        objective: 'OUTCOME_TRAFFIC' as const,
        daily_budget: 5000,
      };

      const mockCreatedCampaign = {
        id: 'generated-id',
        name: campaignData.name,
        objective: campaignData.objective,
        status: 'ACTIVE',
        stop_time: expect.any(Number),
        created_at: expect.any(Date),
      };

      mockQuery.mockResolvedValue({ rows: [mockCreatedCampaign] });

      const result = await CampaignModel.create(campaignData);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO campaigns (id, name, objective, status, stop_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          expect.any(String),
          campaignData.name,
          campaignData.objective,
          'ACTIVE',
          expect.any(Number),
        ]
      );
      expect(result).toEqual(mockCreatedCampaign);
    });

    it('should use provided stop_time if given', async () => {
      const stopTime = Date.now() + 86400000;
      const campaignData = {
        name: 'New Campaign',
        objective: 'OUTCOME_TRAFFIC' as const,
        daily_budget: 5000,
        stop_time: stopTime,
      };

      const mockCreatedCampaign = {
        id: 'generated-id',
        name: campaignData.name,
        objective: campaignData.objective,
        status: 'ACTIVE',
        stop_time: stopTime,
        created_at: expect.any(Date),
      };

      mockQuery.mockResolvedValue({ rows: [mockCreatedCampaign] });

      await CampaignModel.create(campaignData);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO campaigns (id, name, objective, status, stop_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          expect.any(String),
          campaignData.name,
          campaignData.objective,
          'ACTIVE',
          stopTime,
        ]
      );
    });
  });

  describe('update', () => {
    it('should update a campaign', async () => {
      const updates = { name: 'Updated Campaign', status: 'PAUSED' as const };
      const mockUpdatedCampaign = {
        id: 'test-1',
        ...updates,
        objective: 'OUTCOME_TRAFFIC',
        stop_time: Date.now(),
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockUpdatedCampaign] });

      const result = await CampaignModel.update('test-1', updates);

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE campaigns SET name = $2, status = $3 WHERE id = $1 RETURNING *',
        ['test-1', 'Updated Campaign', 'PAUSED']
      );
      expect(result).toEqual(mockUpdatedCampaign);
    });

    it('should return null if campaign not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await CampaignModel.update('nonexistent', {
        name: 'Test',
      });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a campaign and return true', async () => {
      mockQuery.mockResolvedValue({ rowCount: 1 });

      const result = await CampaignModel.delete('test-1');

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM campaigns WHERE id = $1',
        ['test-1']
      );
      expect(result).toBe(true);
    });

    it('should return false if campaign not found', async () => {
      mockQuery.mockResolvedValue({ rowCount: 0 });

      const result = await CampaignModel.delete('nonexistent');

      expect(result).toBe(false);
    });
  });
});
