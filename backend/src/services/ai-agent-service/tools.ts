import { CampaignModel } from '../../models/Campaign';
import { AdSetModel } from '../../models/AdSet';
import { AdModel } from '../../models/Ad';

export type ToolContext = 'campaigns' | 'adsets' | 'ads';

// Campaign Tools
export const campaignTools = [
  {
    name: 'get_all_campaigns',
    description: 'Get all campaigns for the authenticated user',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_campaign',
    description: 'Get a specific campaign by ID',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The campaign ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_campaign',
    description: 'Create a new ad campaign',
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
  {
    name: 'update_campaign',
    description: 'Update an existing campaign',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The campaign ID',
        },
        name: {
          type: 'string' as const,
          description: 'The new campaign name',
        },
        objective: {
          type: 'string' as const,
          enum: [
            'OUTCOME_TRAFFIC',
            'OUTCOME_AWARENESS',
            'OUTCOME_ENGAGEMENT',
            'OUTCOME_LEADS',
          ],
          description: 'The new campaign objective',
        },
        status: {
          type: 'string' as const,
          enum: ['ACTIVE', 'PAUSED'],
          description: 'The campaign status',
        },
        stop_time: {
          type: 'number' as const,
          description: 'Unix timestamp for when campaign should stop',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_campaign',
    description: 'Delete a campaign',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The campaign ID to delete',
        },
      },
      required: ['id'],
    },
  },
];

// AdSet Tools
export const adsetTools = [
  {
    name: 'get_all_adsets',
    description: 'Get all adsets for a specific campaign',
    input_schema: {
      type: 'object' as const,
      properties: {
        campaign_id: {
          type: 'string' as const,
          description: 'The campaign ID to get adsets for',
        },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'get_adset',
    description: 'Get a specific adset by ID',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The adset ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_adset',
    description: 'Create a new ad set',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string' as const,
          description: 'The name of the ad set',
        },
        campaign_id: {
          type: 'string' as const,
          description: 'The campaign ID this ad set belongs to',
        },
        daily_budget: {
          type: 'number' as const,
          description: 'Daily budget in cents (e.g., 5000 for $50.00)',
        },
      },
      required: ['name', 'campaign_id', 'daily_budget'],
    },
  },
  {
    name: 'update_adset',
    description: 'Update an existing ad set',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The adset ID',
        },
        name: {
          type: 'string' as const,
          description: 'The new adset name',
        },
        daily_budget: {
          type: 'number' as const,
          description: 'New daily budget in cents',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_adset',
    description: 'Delete an ad set',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The adset ID to delete',
        },
      },
      required: ['id'],
    },
  },
];

// Ad Tools
export const adTools = [
  {
    name: 'get_all_ads',
    description: 'Get all ads for a specific ad set',
    input_schema: {
      type: 'object' as const,
      properties: {
        adset_id: {
          type: 'string' as const,
          description: 'The ad set ID to get ads for',
        },
      },
      required: ['adset_id'],
    },
  },
  {
    name: 'get_ad',
    description: 'Get a specific ad by ID',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The ad ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_ad',
    description: 'Create a new ad',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string' as const,
          description: 'The name of the ad',
        },
        adset_id: {
          type: 'string' as const,
          description: 'The ad set ID this ad belongs to',
        },
        creative_id: {
          type: 'string' as const,
          description: 'The creative ID for this ad',
        },
        status: {
          type: 'string' as const,
          enum: ['ACTIVE', 'PAUSED'],
          description: 'The ad status (defaults to ACTIVE)',
        },
      },
      required: ['name', 'adset_id', 'creative_id'],
    },
  },
  {
    name: 'update_ad',
    description: 'Update an existing ad',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The ad ID',
        },
        name: {
          type: 'string' as const,
          description: 'The new ad name',
        },
        creative_id: {
          type: 'string' as const,
          description: 'The new creative ID',
        },
        status: {
          type: 'string' as const,
          enum: ['ACTIVE', 'PAUSED'],
          description: 'The ad status',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_ad',
    description: 'Delete an ad',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'The ad ID to delete',
        },
      },
      required: ['id'],
    },
  },
];

// Function to get tools based on context
export const getToolsForContext = (context: ToolContext) => {
  switch (context) {
    case 'campaigns':
      return campaignTools;
    case 'adsets':
      return adsetTools;
    case 'ads':
      return adTools;
    default:
      return campaignTools;
  }
};

// Tool execution functions
export const executeToolFunction = async (
  toolName: string,
  input: any,
  userId?: string
) => {
  switch (toolName) {
    // Campaign tools
    case 'get_all_campaigns':
      return await CampaignModel.getAll(userId);

    case 'get_campaign':
      return await CampaignModel.getById(input.id);

    case 'create_campaign':
      if (!userId) throw new Error('User authentication required');
      return await CampaignModel.create({
        ...input,
        user_id: userId,
      });

    case 'update_campaign':
      const { id, ...updates } = input;
      return await CampaignModel.update(id, updates);

    case 'delete_campaign':
      return await CampaignModel.delete(input.id);

    // AdSet tools
    case 'get_all_adsets':
      return await AdSetModel.getByCampaignId(input.campaign_id);

    case 'get_adset':
      return await AdSetModel.getById(input.id);

    case 'create_adset':
      return await AdSetModel.create(input);

    case 'update_adset':
      const { id: adsetId, ...adsetUpdates } = input;
      return await AdSetModel.update(adsetId, adsetUpdates);

    case 'delete_adset':
      return await AdSetModel.delete(input.id);

    // Ad tools
    case 'get_all_ads':
      return await AdModel.getByAdSetId(input.adset_id);

    case 'get_ad':
      return await AdModel.getById(input.id);

    case 'create_ad':
      return await AdModel.create(input);

    case 'update_ad':
      const { id: adId, ...adUpdates } = input;
      return await AdModel.update(adId, adUpdates);

    case 'delete_ad':
      return await AdModel.delete(input.id);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
};
