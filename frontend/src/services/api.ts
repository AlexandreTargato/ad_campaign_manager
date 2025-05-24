import axios from 'axios';
import {
  Campaign,
  CreateCampaignRequest,
  LoginRequest,
  CreateUserRequest,
  AuthResponse,
  User,
  AdSet,
  Ad,
  ChatResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken: string | null = localStorage.getItem('authToken');

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid token
      authToken = null;
      localStorage.removeItem('authToken');
      // Redirect to login could be handled here
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => authToken;

export const campaignAPI = {
  getAll: (): Promise<Campaign[]> =>
    api.get('/campaigns').then((res) => res.data),

  getById: (id: string): Promise<Campaign> =>
    api.get(`/campaigns/${id}`).then((res) => res.data),

  create: (campaign: CreateCampaignRequest): Promise<Campaign> =>
    api.post('/campaigns', campaign).then((res) => res.data),

  update: (id: string, updates: Partial<Campaign>): Promise<Campaign> =>
    api.put(`/campaigns/${id}`, updates).then((res) => res.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/campaigns/${id}`).then((res) => res.data),
};

export const authAPI = {
  login: (credentials: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then((res) => res.data),

  register: (userData: CreateUserRequest): Promise<AuthResponse> =>
    api.post('/auth/register', userData).then((res) => res.data),

  getProfile: (): Promise<{ user: User }> =>
    api.get('/auth/profile').then((res) => res.data),

  refreshToken: (): Promise<{ token: string; user: User }> =>
    api.post('/auth/refresh').then((res) => res.data),
};

export const adsetAPI = {
  getByCampaignId: (campaignId: string): Promise<AdSet[]> =>
    api.get(`/campaigns/${campaignId}/adsets`).then((res) => res.data),

  getById: (id: string): Promise<AdSet> =>
    api.get(`/adsets/${id}`).then((res) => res.data),

  create: (adsetData: Omit<AdSet, 'id'>): Promise<AdSet> =>
    api.post('/adsets', adsetData).then((res) => res.data),

  update: (id: string, updates: Partial<AdSet>): Promise<AdSet> =>
    api.put(`/adsets/${id}`, updates).then((res) => res.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/adsets/${id}`).then((res) => res.data),
};

export const adAPI = {
  getByAdsetId: (adsetId: string): Promise<Ad[]> =>
    api.get(`/adsets/${adsetId}/ads`).then((res) => res.data),

  getById: (id: string): Promise<Ad> =>
    api.get(`/ads/${id}`).then((res) => res.data),

  create: (adData: Omit<Ad, 'id'>): Promise<Ad> =>
    api.post('/ads', adData).then((res) => res.data),

  update: (id: string, updates: Partial<Ad>): Promise<Ad> =>
    api.put(`/ads/${id}`, updates).then((res) => res.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/ads/${id}`).then((res) => res.data),
};

export const chatAPI = {
  sendMessage: (
    message: string,
    action?: string,
    campaignData?: any,
    context?: string,
    contextData?: any
  ): Promise<ChatResponse> =>
    api
      .post('/chat', { message, action, campaignData, context, contextData })
      .then((res) => res.data),

  clearContext: (): Promise<void> =>
    api.delete('/chat/context').then((res) => res.data),
};

export default api;
