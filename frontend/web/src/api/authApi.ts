import { apiClient } from './apiClient';

export const authApi = {
  signup: async (data: any) => {
    const res = await apiClient.post('/auth/signup', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
  refresh: async () => {
    const res = await apiClient.post('/auth/refresh');
    return res.data;
  },
};
