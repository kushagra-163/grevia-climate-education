import { apiClient } from './apiClient';

export const userApi = {
  getMe: async () => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },
  updateMe: async (data: any) => {
    const res = await apiClient.patch('/users/me', data);
    return res.data;
  },
  getUserProfile: async (id: string) => {
    const res = await apiClient.get(`/users/${id}/profile`);
    return res.data;
  },
  updateProfile: async (id: string, data: any) => {
    const res = await apiClient.patch(`/users/${id}/profile`, data);
    return res.data;
  },
  getPoints: async (id: string) => {
    const res = await apiClient.get(`/users/${id}/points`);
    return res.data;
  },
  getBadges: async (id: string) => {
    const res = await apiClient.get(`/users/${id}/badges`);
    return res.data;
  },
  getProgressSummary: async (id: string) => {
    const res = await apiClient.get(`/users/${id}/progress-summary`);
    return res.data;
  },
};
