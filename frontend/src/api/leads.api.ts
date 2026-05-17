import api from './client';
import { Lead, PaginatedResponse } from '../types';

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export const leadsApi = {
  getLeads: async (filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await api.get(`/leads?${params.toString()}`);
    return response.data.data;
  },

  getLead: async (id: string): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data.data;
  },

  createLead: async (lead: Partial<Lead>): Promise<Lead> => {
    const response = await api.post('/leads', lead);
    return response.data.data;
  },

  updateLead: async (id: string, lead: Partial<Lead>): Promise<Lead> => {
    const response = await api.put(`/leads/${id}`, lead);
    return response.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    won: number;
    lost: number;
  }> => {
    const response = await api.get('/leads/stats');
    return response.data.data;
  },

  exportLeads: async (filters: LeadFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};