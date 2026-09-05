import axios from 'axios';
import { env } from '../config/env';

export class AiClientService {
  private static client = axios.create({
    baseURL: env.AI_SERVICE_URL,
    timeout: 10000,
    headers: {
      'x-ai-service-secret': env.AI_SERVICE_SECRET,
      'Content-Type': 'application/json',
    },
  });

  static async chat(userId: string, messages: Array<{ role: string; content: string }>, context?: any) {
    try {
      const response = await this.client.post('/internal/ai/chat', {
        userId,
        messages,
        context,
      });
      return response.data;
    } catch (error: any) {
      console.warn('[AI Client] Microservice unreachable or errored. Returning graceful mock response.');
      const lastMessage = messages[messages.length - 1]?.content || '';
      return {
        reply: `🌱 **Grevia Eco-Coach**: Thank you for your question about climate action! Regarding "${lastMessage.slice(0, 50)}...", remember that every individual step counts. Renewable transition, energy efficiency, and waste reduction are three of the most effective levers we have. What specific habit would you like to explore next?`,
        model: 'grevia-fallback-coach',
      };
    }
  }

  static async quizExplanation(userId: string, question: string, userAnswer: string, correctAnswer: string) {
    try {
      const response = await this.client.post('/internal/ai/quiz-explanation', {
        userId,
        question,
        userAnswer,
        correctAnswer,
      });
      return response.data;
    } catch (error: any) {
      return {
        explanation: `💡 **Explanation**: The correct answer is **${correctAnswer}**. Your selection was **${userAnswer}**. Climate systems respond directly to greenhouse gas concentrations and energy balances. Review the lesson topic for full context!`,
      };
    }
  }

  static async habitSuggestions(userId: string, timeframe = 'daily') {
    try {
      const response = await this.client.post('/internal/ai/habit-suggestions', {
        userId,
        timeframe,
      });
      return response.data;
    } catch (error: any) {
      return {
        suggestions: [
          { title: 'Cold Water Wash', impact: 'Medium', description: 'Wash laundry in cold water to save heating energy.' },
          { title: 'Meatless Meal', impact: 'High', description: 'Choose plant-based options once today to reduce carbon emissions.' },
          { title: 'Unplug Standby Devices', impact: 'Low', description: 'Disconnect electronics when not in use.' },
        ],
      };
    }
  }
}
