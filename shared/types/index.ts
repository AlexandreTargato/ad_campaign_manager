// Core entity types
export interface Campaign {
  id: string;
  name: string;
  objective:
    | 'OUTCOME_TRAFFIC'
    | 'OUTCOME_AWARENESS'
    | 'OUTCOME_ENGAGEMENT'
    | 'OUTCOME_LEADS';
  status: 'PAUSED' | 'ACTIVE';
  stop_time: number;
  user_id: string;
  created_at?: string;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  daily_budget: number; // in cents
  created_at?: string;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  creative_id: string;
  status: 'PAUSED' | 'ACTIVE';
  created_at?: string;
}

// User and auth types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// API request types
export interface CreateCampaignRequest {
  name: string;
  objective: Campaign['objective'];
  daily_budget: number;
  stop_time?: number;
  user_id?: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  campaignCreated?: Campaign;
  shouldRefresh?: boolean;
  actionResult?: any;
}

export interface ChatRequest {
  message: string;
  action?: string;
  campaignData?: any;
  context?: string;
  contextData?: any;
}

export interface ChatResponse extends ChatMessage {
  // Inherits all ChatMessage properties
}

// AI Tool types
export type ToolContext = 'campaigns' | 'adsets' | 'ads';

export interface AIServiceResponse {
  content: string;
  actionResult?: any;
  shouldRefresh?: boolean;
}

export interface ChatContextData {
  type: ToolContext;
  data?: any;
  campaignId?: string;
  adsetId?: string;
  campaign?: Campaign;
  adset?: AdSet;
}