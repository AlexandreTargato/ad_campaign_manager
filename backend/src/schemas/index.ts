import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required'),
});

// Campaign schemas
export const campaignObjectiveSchema = z.enum([
  'OUTCOME_TRAFFIC',
  'OUTCOME_AWARENESS',
  'OUTCOME_ENGAGEMENT',
  'OUTCOME_LEADS',
]);

export const campaignStatusSchema = z.enum(['PAUSED', 'ACTIVE']);

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  objective: campaignObjectiveSchema,
  daily_budget: z.number().positive('Daily budget must be greater than 0'),
  stop_time: z.number().positive('Stop time must be a positive number'),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  objective: campaignObjectiveSchema.optional(),
  status: campaignStatusSchema.optional(),
  daily_budget: z.number().positive().optional(),
  stop_time: z.number().positive().optional(),
});

// AdSet schemas
export const createAdSetSchema = z.object({
  name: z.string().min(1, 'AdSet name is required'),
  campaign_id: z.string().uuid('Campaign ID must be a valid UUID'),
  daily_budget: z.number().positive('Daily budget must be greater than 0'),
});

export const updateAdSetSchema = z.object({
  name: z.string().min(1).optional(),
  campaign_id: z.string().uuid().optional(),
  daily_budget: z.number().positive().optional(),
});

// Ad schemas
export const adStatusSchema = z.enum(['PAUSED', 'ACTIVE']);

export const createAdSchema = z.object({
  name: z.string().min(1, 'Ad name is required'),
  adset_id: z.string().uuid('AdSet ID must be a valid UUID'),
  creative_id: z.string().min(1, 'Creative ID is required'),
  status: adStatusSchema.optional(),
});

export const updateAdSchema = z.object({
  name: z.string().min(1).optional(),
  adset_id: z.string().uuid().optional(),
  creative_id: z.string().min(1).optional(),
  status: adStatusSchema.optional(),
});

// Chat schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  action: z.string().optional(),
  campaignData: z.any().optional(),
  context: z.string().optional(),
  contextData: z.any().optional(),
});

// Parameter validation schemas
export const uuidParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

export const campaignIdParamSchema = z.object({
  campaignId: z.string().uuid('Campaign ID must be a valid UUID'),
});

export const adsetIdParamSchema = z.object({
  adsetId: z.string().uuid('AdSet ID must be a valid UUID'),
});
