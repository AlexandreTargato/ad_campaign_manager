import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AIService {
  private static conversationContext: string[] = [];

  static async generateResponse(userMessage: string): Promise<string> {
    try {
      // Add system context for campaign creation
      const systemPrompt = `You are an AI assistant helping users create Facebook ad campaigns. 
      
Your goal is to guide users through creating a campaign by asking for:
1. Campaign name
2. Campaign objective (OUTCOME_TRAFFIC, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, or OUTCOME_LEADS)
3. Daily budget (in dollars)
4. Campaign duration/end date

Be conversational, helpful, and ask one question at a time. When you have all the information needed, 
summarize the campaign details and ask for confirmation to create it.

Current conversation context: ${this.conversationContext.join('\n')}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      const response =
        message.content[0].type === 'text' ? message.content[0].text : '';

      // Update conversation context
      this.conversationContext.push(`User: ${userMessage}`);
      this.conversationContext.push(`Assistant: ${response}`);

      // Keep only last 10 exchanges to manage context length
      if (this.conversationContext.length > 20) {
        this.conversationContext = this.conversationContext.slice(-20);
      }

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.';
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
