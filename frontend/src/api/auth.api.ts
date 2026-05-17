import api from './client';
import { User } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role?: string
  ): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },
};