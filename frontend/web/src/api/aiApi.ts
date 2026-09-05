import { apiClient } from './apiClient';

export const aiApi = {
  chat: async (messages: Array<{ role: string; content: string }>, context?: any) => {
    const res = await apiClient.post('/ai/chat', { messages, context });
    return res.data;
  },
  quizExplanation: async (question: string, userAnswer: string, correctAnswer: string) => {
    const res = await apiClient.post('/ai/quiz-explanation', { question, userAnswer, correctAnswer });
    return res.data;
  },
  habitSuggestions: async (timeframe = 'daily') => {
    const res = await apiClient.post('/ai/habit-suggestions', { timeframe });
    return res.data;
  },
};
