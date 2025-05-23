import { Request, Response } from 'express';
import { ChatController } from '../../controllers/chatController';
import { AIService } from '../../services/aiService';
import { CampaignModel } from '../../models/Campaign';

// Mock dependencies
jest.mock('../../services/aiService');
jest.mock('../../models/Campaign');

const mockAIService = AIService as jest.Mocked<typeof AIService>;
const mockCampaignModel = CampaignModel as jest.Mocked<typeof CampaignModel>;

describe('ChatController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('handleChatMessage', () => {
    it('should return 400 if message is missing', async () => {
      mockRequest.body = {};

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Message is required',
      });
    });

    it('should handle regular chat messages', async () => {
      mockRequest.body = { message: 'Hello' };

      mockAIService.generateResponse.mockResolvedValue({
        content: 'Hi! How can I help you create a campaign?',
      });

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockAIService.generateResponse).toHaveBeenCalledWith('Hello');
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: expect.any(String),
        role: 'assistant',
        content: 'Hi! How can I help you create a campaign?',
        timestamp: expect.any(Date),
      });
    });

    it('should handle chat messages that create campaigns', async () => {
      mockRequest.body = { message: 'Create a summer sale campaign' };

      const mockCampaign = {
        id: 'camp-123',
        name: 'Summer Sale',
        objective: 'OUTCOME_TRAFFIC',
        status: 'ACTIVE',
        stop_time: Date.now(),
        created_at: new Date(),
      };

      mockAIService.generateResponse.mockResolvedValue({
        content:
          'Great! I\'ve successfully created your campaign "Summer Sale"',
        campaignCreated: mockCampaign,
      });

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        id: expect.any(String),
        role: 'assistant',
        content:
          'Great! I\'ve successfully created your campaign "Summer Sale"',
        timestamp: expect.any(Date),
        campaignCreated: mockCampaign,
      });
    });

    it('should handle create_campaign action', async () => {
      const campaignData = {
        name: 'Test Campaign',
        objective: 'OUTCOME_TRAFFIC',
      };

      mockRequest.body = {
        message: 'Create campaign',
        action: 'create_campaign',
        campaignData,
      };

      const mockCreatedCampaign = {
        id: 'camp-456',
        ...campaignData,
        status: 'ACTIVE',
        stop_time: Date.now(),
        created_at: new Date(),
      };

      mockCampaignModel.create.mockResolvedValue(mockCreatedCampaign as any);

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockCampaignModel.create).toHaveBeenCalledWith(campaignData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: expect.any(String),
        role: 'assistant',
        content: expect.stringContaining(
          'successfully created your campaign "Test Campaign"'
        ),
        timestamp: expect.any(Date),
        campaignCreated: mockCreatedCampaign,
      });
    });

    it('should return 400 for create_campaign action without required data', async () => {
      mockRequest.body = {
        message: 'Create campaign',
        action: 'create_campaign',
        campaignData: { name: 'Test' }, // Missing objective
      };

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Campaign name and objective are required',
      });
    });

    it('should handle campaign creation errors in create_campaign action', async () => {
      const campaignData = {
        name: 'Test Campaign',
        objective: 'OUTCOME_TRAFFIC',
      };

      mockRequest.body = {
        message: 'Create campaign',
        action: 'create_campaign',
        campaignData,
      };

      mockCampaignModel.create.mockRejectedValue(new Error('Database error'));

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        id: expect.any(String),
        role: 'assistant',
        content: expect.stringContaining('error creating your campaign'),
        timestamp: expect.any(Date),
      });
    });

    it('should handle AI service errors', async () => {
      mockRequest.body = { message: 'Hello' };

      mockAIService.generateResponse.mockRejectedValue(
        new Error('AI Service error')
      );

      await ChatController.handleChatMessage(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('clearChatContext', () => {
    it('should clear chat context successfully', async () => {
      await ChatController.clearChatContext(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockAIService.clearContext).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Chat context cleared successfully',
      });
    });

    it('should handle errors when clearing context', async () => {
      mockAIService.clearContext.mockImplementation(() => {
        throw new Error('Clear context error');
      });

      await ChatController.clearChatContext(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});
