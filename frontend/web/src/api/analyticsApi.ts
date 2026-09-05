import { apiClient } from './apiClient';

export const analyticsApi = {
  getUserAnalytics: async (userId: string) => {
    const res = await apiClient.get(`/analytics/user/${userId}`);
    return res.data;
  },
  getClassAnalytics: async (classId: string) => {
    const res = await apiClient.get(`/analytics/class/${classId}`);
    return res.data;
  },
  getCommunityAnalytics: async () => {
    const res = await apiClient.get('/analytics/community');
    return res.data;
  },
};
