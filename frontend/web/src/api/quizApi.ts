import { apiClient } from './apiClient';

export const quizApi = {
  generate: async (data: { topic: string; difficulty?: string; numQuestions?: number }) => {
    const res = await apiClient.post('/quiz/generate', data);
    return res.data;
  },
  getQuiz: async (quizId: string) => {
    const res = await apiClient.get(`/quiz/${quizId}`);
    return res.data;
  },
  submit: async (quizId: string, answers: string[], responseTimes: number[]) => {
    const res = await apiClient.post(`/quiz/${quizId}/submit`, { answers, responseTimes });
    return res.data;
  },
  getHistory: async (userId: string) => {
    const res = await apiClient.get(`/quiz/user/${userId}/history`);
    return res.data;
  },
  getSkills: async (userId: string) => {
    const res = await apiClient.get(`/quiz/user/${userId}/skills`);
    return res.data;
  },
};
