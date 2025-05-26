import axios from 'axios';

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  daily_budget: string;
}

export interface MetaCampaignResponse {
  data: MetaCampaign[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

export class MetaApiService {
  private static readonly BASE_URL = 'https://graph.facebook.com/v22.0';
  private static readonly ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;
  private static readonly ACCOUNT_ID = process.env.ACCOUNT_ID!;

  static async getCampaigns(): Promise<MetaCampaign[]> {
    try {
      const url = `${this.BASE_URL}/act_${this.ACCOUNT_ID}/campaigns`;
      const params = {
        fields: 'id,name,status,daily_budget',
        access_token: this.ACCESS_TOKEN,
      };

      const response = await axios.get<MetaCampaignResponse>(url, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching campaigns from Meta API:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Meta API Error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw new Error('Failed to fetch campaigns from Meta API');
    }
  }
}