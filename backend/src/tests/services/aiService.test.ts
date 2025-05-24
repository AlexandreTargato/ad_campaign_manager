// Mock dependencies first
const mockCreate = jest.fn();

jest.mock('../../models/Campaign', () => ({
  CampaignModel: {
    create: mockCreate,
  },
}));

const mockMessagesCreate = jest.fn();

jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: mockMessagesCreate,
    },
  }));
});

import { AIService } from '../../services/ai-agent-service/aiService';

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AIService.clearContext();
  });

  describe('generateResponse', () => {
    it('should generate a text response when no tool use', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: 'Hello! I can help you create ad campaigns. What would you like to name your campaign?',
          },
        ],
      };

      mockMessagesCreate.mockResolvedValue(mockResponse);

      const result = await AIService.generateResponse(
        'I want to create a campaign'
      );

      expect(result.content).toBe(
        'Hello! I can help you create ad campaigns. What would you like to name your campaign?'
      );
      expect(result.campaignCreated).toBeUndefined();
    });

    it('should create a campaign when tool is used', async () => {
      const mockToolResponse = {
        content: [
          {
            type: 'tool_use',
            name: 'create_campaign',
            input: {
              name: 'Summer Sale',
              objective: 'OUTCOME_TRAFFIC',
            },
          },
        ],
      };

      const mockCreatedCampaign = {
        id: 'camp-123',
        name: 'Summer Sale',
        objective: 'OUTCOME_TRAFFIC',
        status: 'ACTIVE',
        stop_time: Date.now(),
        created_at: new Date(),
      };

      mockMessagesCreate.mockResolvedValue(mockToolResponse);
      mockCreate.mockResolvedValue(mockCreatedCampaign);

      const result = await AIService.generateResponse(
        'Create a Summer Sale campaign for traffic'
      );

      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Summer Sale',
        objective: 'OUTCOME_TRAFFIC',
      });
      expect(result.content).toContain(
        'successfully created your campaign "Summer Sale"'
      );
      expect(result.campaignCreated).toEqual(mockCreatedCampaign);
    });

    it('should handle campaign creation errors gracefully', async () => {
      const mockToolResponse = {
        content: [
          {
            type: 'tool_use',
            name: 'create_campaign',
            input: {
              name: 'Test Campaign',
              objective: 'OUTCOME_TRAFFIC',
            },
          },
        ],
      };

      mockMessagesCreate.mockResolvedValue(mockToolResponse);
      mockCreate.mockRejectedValue(new Error('Database error'));

      const result = await AIService.generateResponse('Create a test campaign');

      expect(result.content).toContain('error creating your campaign');
      expect(result.campaignCreated).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      mockMessagesCreate.mockRejectedValue(new Error('API error'));

      const result = await AIService.generateResponse('Hello');

      expect(result.content).toContain('encountered an error');
    });

    it('should maintain conversation context', async () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: 'Great! What objective would you like for your campaign?',
          },
        ],
      };

      mockMessagesCreate.mockResolvedValue(mockResponse);

      await AIService.generateResponse(
        'I want to create a campaign called "Test Campaign"'
      );
      await AIService.generateResponse('What are the objective options?');

      // Check that the system prompt includes conversation context
      const createCalls = mockMessagesCreate.mock.calls;
      expect(createCalls[1][0].system).toContain(
        'User: I want to create a campaign called "Test Campaign"'
      );
    });

    it('should limit conversation context to 20 entries', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
      };

      mockMessagesCreate.mockResolvedValue(mockResponse);

      // Generate 15 exchanges (30 context entries)
      for (let i = 0; i < 15; i++) {
        await AIService.generateResponse(`Message ${i}`);
      }

      // The context should be trimmed to last 20 entries
      const lastCall = mockMessagesCreate.mock.calls.slice(-1)[0];
      const contextLines = lastCall[0].system
        .split('\n')
        .filter(
          (line: string) =>
            line.startsWith('User:') || line.startsWith('Assistant:')
        );

      expect(contextLines.length).toBeLessThanOrEqual(20);
    });
  });

  describe('clearContext', () => {
    it('should clear conversation context', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response' }],
      };

      mockMessagesCreate.mockResolvedValue(mockResponse);

      // Add some context
      await AIService.generateResponse('Hello');

      // Clear context
      AIService.clearContext();

      // Next call should have empty context
      await AIService.generateResponse('New conversation');

      const lastCall = mockMessagesCreate.mock.calls.slice(-1)[0];
      expect(lastCall[0].system).not.toContain('User: Hello');
    });
  });

  describe('extractCampaignData', () => {
    it('should extract traffic objective', () => {
      const conversation = ['I want to drive traffic to my website'];
      const result = AIService.extractCampaignData(conversation);

      expect(result.objective).toBe('OUTCOME_TRAFFIC');
    });

    it('should extract awareness objective', () => {
      const conversation = ['I want to increase brand awareness'];
      const result = AIService.extractCampaignData(conversation);

      expect(result.objective).toBe('OUTCOME_AWARENESS');
    });

    it('should extract engagement objective', () => {
      const conversation = ['I want more likes and comments'];
      const result = AIService.extractCampaignData(conversation);

      expect(result.objective).toBe('OUTCOME_ENGAGEMENT');
    });

    it('should extract leads objective', () => {
      const conversation = ['I want to generate leads'];
      const result = AIService.extractCampaignData(conversation);

      expect(result.objective).toBe('OUTCOME_LEADS');
    });

    it('should extract budget from conversation', () => {
      const conversation = ['My budget is $50 per day'];
      const result = AIService.extractCampaignData(conversation);

      expect(result.daily_budget).toBe(5000); // $50 in cents
    });

    it('should handle budget without dollar sign', () => {
      const conversation = ['I can spend 25 dollars daily'];
      const result = AIService.extractCampaignData(conversation);

      expect(result.daily_budget).toBe(2500); // $25 in cents
    });
  });
});
