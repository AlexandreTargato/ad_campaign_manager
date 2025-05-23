export interface Campaign {
  id: string;
  name: string;
  objective: "OUTCOME_TRAFFIC" | "OUTCOME_AWARENESS" | "OUTCOME_ENGAGEMENT" | "OUTCOME_LEADS";
  status: "PAUSED" | "ACTIVE";
  stop_time: number;
  created_at?: Date;
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
  creative: {
    creative_id: string;
  };
  status: "PAUSED" | "ACTIVE";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CreateCampaignRequest {
  name: string;
  objective: Campaign["objective"];
  daily_budget: number;
  stop_time?: number;
}