import { apiClient } from './apiClient';

export const climateApi = {
  getCurrent: async (location = 'Berlin', country?: string) => {
    const res = await apiClient.get('/climate/current', { params: { location, country } });
    return res.data;
  },
  getTrends: async (location = 'Berlin', days = 7, country?: string) => {
    const res = await apiClient.get('/climate/trends', { params: { location, days, country } });
    return res.data;
  },
};
