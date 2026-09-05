import { apiClient } from './apiClient';

export const gamificationApi = {
  logAction: async (type: string, metadata?: any) => {
    const res = await apiClient.post('/actions/log', { type, metadata });
    return res.data;
  },
  getLeaderboard: async (scope = 'global', scopeId?: string, limit = 20, offset = 0) => {
    const res = await apiClient.get('/leaderboard', {
      params: { scope, scopeId, limit, offset },
    });
    return res.data;
  },
  getMissions: async () => {
    const res = await apiClient.get('/missions');
    return res.data;
  },
  joinMission: async (missionId: string) => {
    const res = await apiClient.post(`/missions/${missionId}/join`);
    return res.data;
  },
  getUserMissions: async () => {
    const res = await apiClient.get('/missions/user/status');
    return res.data;
  },
};
