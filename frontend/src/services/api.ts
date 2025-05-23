import axios from 'axios';
import { Campaign, CreateCampaignRequest, ChatMessage } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const campaignAPI = {
  getAll: (): Promise<Campaign[]> => 
    api.get('/campaigns').then(res => res.data),
  
  getById: (id: string): Promise<Campaign> => 
    api.get(`/campaigns/${id}`).then(res => res.data),
  
  create: (campaign: CreateCampaignRequest): Promise<Campaign> => 
    api.post('/campaigns', campaign).then(res => res.data),
  
  update: (id: string, updates: Partial<Campaign>): Promise<Campaign> => 
    api.put(`/campaigns/${id}`, updates).then(res => res.data),
  
  delete: (id: string): Promise<void> => 
    api.delete(`/campaigns/${id}`).then(res => res.data),
};

export const chatAPI = {
  sendMessage: (message: string, action?: string, campaignData?: any): Promise<ChatMessage> => 
    api.post('/chat', { message, action, campaignData }).then(res => res.data),
  
  clearContext: (): Promise<void> => 
    api.delete('/chat/context').then(res => res.data),
};

export default api;