export interface Campaign {
  id: string;
  name: string;
  objective: "OUTCOME_TRAFFIC" | "OUTCOME_AWARENESS" | "OUTCOME_ENGAGEMENT" | "OUTCOME_LEADS";
  status: "PAUSED" | "ACTIVE";
  stop_time: number;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  campaignCreated?: Campaign;
}

export interface CreateCampaignRequest {
  name: string;
  objective: Campaign["objective"];
  daily_budget: number;
  stop_time?: number;
}