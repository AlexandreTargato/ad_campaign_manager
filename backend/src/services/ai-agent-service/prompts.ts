import { ToolContext } from './tools';

export class PromptService {
  static getSystemPrompt(
    context: ToolContext,
    contextData: any,
    conversationHistory: string[]
  ): string {
    const baseContext =
      conversationHistory.length > 0
        ? `\n\nCurrent conversation context: ${conversationHistory.join('\n')}`
        : '';

    switch (context) {
      case 'campaigns':
        return this.getCampaignPrompt() + baseContext;
      case 'adsets':
        return this.getAdSetPrompt(contextData) + baseContext;
      case 'ads':
        return this.getAdPrompt(contextData) + baseContext;
      default:
        return this.getDefaultPrompt() + baseContext;
    }
  }

  private static getCampaignPrompt(): string {
    return `You are an AI assistant helping users manage Facebook ad campaigns. 

Your goal is to help users:
1. View and manage existing campaigns
2. Create new campaigns (ask for name, objective: OUTCOME_TRAFFIC, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, or OUTCOME_LEADS)
3. Update campaign settings (name, objective, status, stop_time)
4. Delete campaigns when requested

Be conversational and helpful. When users want to create campaigns, ask for the required information one step at a time.
Use the available tools to retrieve, create, update, or delete campaigns as needed.`;
  }

  private static getAdSetPrompt(contextData: any): string {
    const campaignInfo = contextData?.campaign
      ? `\n\nYou are currently helping with ad sets for the campaign "${contextData.campaign.name}" (ID: ${contextData.campaign.id}).`
      : '';

    return `You are an AI assistant helping users manage ad sets within Facebook campaigns.${campaignInfo}

Your goal is to help users:
1. View and manage existing ad sets
2. Create new ad sets (ask for name, daily budget in cents - e.g., 5000 for $50.00)
3. Update ad set settings (name, daily budget)
4. Delete ad sets when requested

Be conversational and helpful. When creating ad sets, explain that the daily budget should be in cents.
Use the available tools to retrieve, create, update, or delete ad sets as needed.`;
  }

  private static getAdPrompt(contextData: any): string {
    const adsetInfo = contextData?.adset
      ? `\n\nYou are currently helping with ads for the ad set "${contextData.adset.name}" (ID: ${contextData.adset.id}).`
      : '';

    return `You are an AI assistant helping users manage ads within Facebook ad sets.${adsetInfo}

Your goal is to help users:
1. View and manage existing ads
2. Create new ads (ask for name, creative ID, and status: ACTIVE or PAUSED)
3. Update ad settings (name, creative ID, status)
4. Delete ads when requested

Be conversational and helpful. When creating ads, ask for a creative ID (this would typically be from their media library).
Use the available tools to retrieve, create, update, or delete ads as needed.`;
  }

  private static getDefaultPrompt(): string {
    return `You are an AI assistant helping users manage Facebook advertising campaigns, ad sets, and ads.`;
  }

  static generateToolResponse(
    toolName: string,
    result: any,
    context: ToolContext
  ): string {
    switch (toolName) {
      // Campaign responses
      case 'get_all_campaigns':
        return this.getCampaignListResponse(result);
      case 'get_campaign':
        return this.getCampaignDetailResponse(result);
      case 'create_campaign':
        return this.getCampaignCreatedResponse(result);
      case 'update_campaign':
        return this.getCampaignUpdatedResponse(result);
      case 'delete_campaign':
        return this.getCampaignDeletedResponse();

      // AdSet responses
      case 'get_all_adsets':
        return this.getAdSetListResponse(result);
      case 'get_adset':
        return this.getAdSetDetailResponse(result);
      case 'create_adset':
        return this.getAdSetCreatedResponse(result);
      case 'update_adset':
        return this.getAdSetUpdatedResponse(result);
      case 'delete_adset':
        return this.getAdSetDeletedResponse();

      // Ad responses
      case 'get_all_ads':
        return this.getAdListResponse(result);
      case 'get_ad':
        return this.getAdDetailResponse(result);
      case 'create_ad':
        return this.getAdCreatedResponse(result);
      case 'update_ad':
        return this.getAdUpdatedResponse(result);
      case 'delete_ad':
        return this.getAdDeletedResponse();

      default:
        return 'Operation completed successfully.';
    }
  }

  // Campaign response methods
  private static getCampaignListResponse(campaigns: any[]): string {
    return campaigns.length > 0
      ? `I found ${
          campaigns.length
        } campaign(s). Here are your campaigns: ${campaigns
          .map(
            (c: any) => `"${c.name}" (${c.objective.replace('OUTCOME_', '')})`
          )
          .join(', ')}.`
      : "You don't have any campaigns yet. Would you like me to help you create your first campaign?";
  }

  private static getCampaignDetailResponse(campaign: any): string {
    return campaign
      ? `Here's your campaign "${
          campaign.name
        }" with objective ${campaign.objective.replace(
          'OUTCOME_',
          ''
        )} and status ${campaign.status}.`
      : "I couldn't find that campaign. Please check the campaign ID.";
  }

  private static getCampaignCreatedResponse(campaign: any): string {
    return `Excellent! I've successfully created your campaign "${
      campaign.name
    }" with objective ${campaign.objective.replace(
      'OUTCOME_',
      ''
    )}. The campaign is now ${campaign.status.toLowerCase()} and ready to go!`;
  }

  private static getCampaignUpdatedResponse(campaign: any): string {
    return `Perfect! I've updated your campaign "${campaign.name}". The changes have been applied successfully.`;
  }

  private static getCampaignDeletedResponse(): string {
    return 'Campaign deleted successfully. The campaign and all its ad sets and ads have been removed.';
  }

  // AdSet response methods
  private static getAdSetListResponse(adsets: any[]): string {
    return adsets.length > 0
      ? `I found ${adsets.length} ad set(s): ${adsets
          .map(
            (a: any) =>
              `"${a.name}" ($${(a.daily_budget / 100).toFixed(2)}/day)`
          )
          .join(', ')}.`
      : "This campaign doesn't have any ad sets yet. Would you like me to help you create your first ad set?";
  }

  private static getAdSetDetailResponse(adset: any): string {
    return adset
      ? `Here's your ad set "${adset.name}" with a daily budget of $${(
          adset.daily_budget / 100
        ).toFixed(2)}.`
      : "I couldn't find that ad set. Please check the ad set ID.";
  }

  private static getAdSetCreatedResponse(adset: any): string {
    return `Great! I've created your ad set "${
      adset.name
    }" with a daily budget of $${(adset.daily_budget / 100).toFixed(
      2
    )}. It's ready to start running ads!`;
  }

  private static getAdSetUpdatedResponse(adset: any): string {
    return `Perfect! I've updated your ad set "${adset.name}". The changes have been applied successfully.`;
  }

  private static getAdSetDeletedResponse(): string {
    return 'Ad set deleted successfully. The ad set and all its ads have been removed.';
  }

  // Ad response methods
  private static getAdListResponse(ads: any[]): string {
    return ads.length > 0
      ? `I found ${ads.length} ad(s): ${ads
          .map((a: any) => `"${a.name}" (${a.status})`)
          .join(', ')}.`
      : "This ad set doesn't have any ads yet. Would you like me to help you create your first ad?";
  }

  private static getAdDetailResponse(ad: any): string {
    return ad
      ? `Here's your ad "${ad.name}" with creative ID ${ad.creative_id} and status ${ad.status}.`
      : "I couldn't find that ad. Please check the ad ID.";
  }

  private static getAdCreatedResponse(ad: any): string {
    return `Awesome! I've created your ad "${ad.name}" with creative ID ${
      ad.creative_id
    }. The ad is ${ad.status.toLowerCase()} and ready to reach your audience!`;
  }

  private static getAdUpdatedResponse(ad: any): string {
    return `Perfect! I've updated your ad "${ad.name}". The changes have been applied successfully.`;
  }

  private static getAdDeletedResponse(): string {
    return 'Ad deleted successfully. The ad has been removed from the ad set.';
  }

  static generateErrorResponse(
    toolName: string,
    context: ToolContext,
    error: any
  ): string {
    const errorMessage = error.message || 'Unknown error occurred';

    switch (context) {
      case 'campaigns':
        return `I apologize, but there was an error with your campaign operation: ${errorMessage}. Please try again or check your campaign details.`;
      case 'adsets':
        return `I apologize, but there was an error with your ad set operation: ${errorMessage}. Please try again or check your ad set details.`;
      case 'ads':
        return `I apologize, but there was an error with your ad operation: ${errorMessage}. Please try again or check your ad details.`;
      default:
        return `I apologize, but there was an error: ${errorMessage}. Please try again.`;
    }
  }
}
