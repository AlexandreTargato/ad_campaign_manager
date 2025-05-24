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
  daily_budget: number;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  creative_id: string;
  status: 'PAUSED' | 'ACTIVE';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  campaignCreated?: Campaign;
  shouldRefresh?: boolean;
  actionResult?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface CreateCampaignRequest {
  name: string;
  objective: Campaign['objective'];
  daily_budget: number;
  stop_time?: number;
}
