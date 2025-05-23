import Anthropic from '@anthropic-ai/sdk';
import { CampaignModel } from '../models/Campaign';
import { v4 as uuidv4 } from 'uuid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AIService {
  private static conversationContext: string[] = [];

  static async generateResponse(
    userMessage: string,
    userId?: string
  ): Promise<{ content: string; campaignCreated?: any }> {
    try {
      // Add system context for campaign creation
      const systemPrompt = `You are an AI assistant helping users create Facebook ad campaigns. 

Your goal is to guide users through creating a campaign by asking for:
1. Campaign name
2. Campaign objective (OUTCOME_TRAFFIC, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, or OUTCOME_LEADS)
3. Campaign duration/end date (optional, defaults to 30 days)

Be conversational, helpful, and ask one question at a time. When you have all the required information (name and objective), 
use the create_campaign tool to create the campaign in the database.

Current conversation context: ${this.conversationContext.join('\n')}`;

      const tools = [
        {
          name: 'create_campaign',
          description:
            'Create a new ad campaign in the database when user provides name and objective',
          input_schema: {
            type: 'object' as const,
            properties: {
              name: {
                type: 'string' as const,
                description: 'The name of the campaign',
              },
              objective: {
                type: 'string' as const,
                enum: [
                  'OUTCOME_TRAFFIC',
                  'OUTCOME_AWARENESS',
                  'OUTCOME_ENGAGEMENT',
                  'OUTCOME_LEADS',
                ],
                description: 'The campaign objective',
              },
              stop_time: {
                type: 'number' as const,
                description:
                  'Unix timestamp for when campaign should stop (optional)',
              },
            },
            required: ['name', 'objective'],
          },
        },
      ];

      const message = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        system: systemPrompt,
        tools,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      // Handle tool use
      if (message.content.some((content) => content.type === 'tool_use')) {
        const toolUse = message.content.find(
          (content) => content.type === 'tool_use'
        ) as any;

        if (toolUse.name === 'create_campaign') {
          try {
            // Add user_id to campaign data if provided
            const campaignData = {
              ...toolUse.input,
              user_id: userId,
            };
            
            const campaign = await CampaignModel.create(campaignData);
            const response = `Great! I've successfully created your campaign "${campaign.name}" with objective ${campaign.objective}. The campaign is now active and ready to go!`;

            this.clearContext(); // Clear conversation after successful creation

            return {
              content: response,
              campaignCreated: campaign,
            };
          } catch (error) {
            console.error('Error creating campaign:', error);
            return {
              content:
                'I apologize, but there was an error creating your campaign. Please try again or check the campaign details.',
            };
          }
        }
      }

      // Regular text response
      const response = message.content
        .filter((content) => content.type === 'text')
        .map((content) => (content as any).text)
        .join('');

      // Update conversation context
      this.conversationContext.push(`User: ${userMessage}`);
      this.conversationContext.push(`Assistant: ${response}`);

      // Keep only last 10 exchanges to manage context length
      if (this.conversationContext.length > 20) {
        this.conversationContext = this.conversationContext.slice(-20);
      }

      return { content: response };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        content:
          'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
      };
    }
  }

  static clearContext(): void {
    this.conversationContext = [];
  }

  static extractCampaignData(conversation: string[]): any {
    // Simple extraction logic - in a real app, you'd use more sophisticated NLP
    const fullConversation = conversation.join(' ').toLowerCase();

    const campaignData: any = {};

    // Extract objective
    if (
      fullConversation.includes('traffic') ||
      fullConversation.includes('website visits')
    ) {
      campaignData.objective = 'OUTCOME_TRAFFIC';
    } else if (
      fullConversation.includes('awareness') ||
      fullConversation.includes('brand')
    ) {
      campaignData.objective = 'OUTCOME_AWARENESS';
    } else if (
      fullConversation.includes('engagement') ||
      fullConversation.includes('likes') ||
      fullConversation.includes('comments')
    ) {
      campaignData.objective = 'OUTCOME_ENGAGEMENT';
    } else if (
      fullConversation.includes('leads') ||
      fullConversation.includes('lead generation')
    ) {
      campaignData.objective = 'OUTCOME_LEADS';
    }

    // Extract budget (look for dollar amounts)
    const budgetMatch = fullConversation.match(/\$?(\d+(?:\.\d{2})?)/);
    if (budgetMatch) {
      campaignData.daily_budget = parseFloat(budgetMatch[1]) * 100; // Convert to cents
    }

    return campaignData;
  }
}
