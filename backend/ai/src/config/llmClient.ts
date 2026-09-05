import axios from 'axios';
import { env } from './env';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class LlmClient {
  static async completion(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
    const formattedMessages: ChatMessage[] = [];
    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }
    formattedMessages.push(...messages);

    // If LLM_API_KEY is provided, call external OpenAI-compatible API
    if (env.LLM_API_KEY && env.LLM_API_KEY.trim().length > 0) {
      try {
        const response = await axios.post(
          `${env.LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`,
          {
            model: env.LLM_MODEL,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${env.LLM_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 12000,
          }
        );
        return response.data.choices[0]?.message?.content || 'I could not generate a response at this time.';
      } catch (error: any) {
        console.warn('[LLM Client] External LLM API request failed. Falling back to deterministic mock provider:', error.message);
      }
    }

    // Deterministic Mock Provider Fallback
    return this.mockCompletion(formattedMessages);
  }

  private static mockCompletion(messages: ChatMessage[]): string {
    const userMessages = messages.filter((m) => m.role === 'user');
    const lastUserQuery = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

    if (lastUserQuery.includes('quiz') || lastUserQuery.includes('explanation')) {
      return `💡 **Grevia AI Explanation**: Climate feedback loops occur when an initial change causes subsequent processes that amplify or dampen the primary climate effect. Understanding greenhouse gas warming potentials helps prioritize emissions reduction strategies.`;
    }

    if (lastUserQuery.includes('habit') || lastUserQuery.includes('suggestion') || lastUserQuery.includes('daily')) {
      return `🌱 **Recommended Climate Action**: Try reducing food waste this week by planning meals ahead, shifting 2 meals to plant-based choices, and switching household lighting to LEDs. These 3 simple choices save up to 4.2 kg CO₂ equivalent daily!`;
    }

    if (lastUserQuery.includes('renewable') || lastUserQuery.includes('solar') || lastUserQuery.includes('wind')) {
      return `☀️ **Grevia Eco-Coach**: Solar photovoltaics and wind turbines generate clean electricity with zero direct greenhouse gas emissions during operation. Modern grid storage technology allows communities to store excess renewable power efficiently!`;
    }

    return `🌍 **Grevia Eco-Coach**: Welcome! Climate change represents a global shift in average temperature and weather patterns driven primarily by human greenhouse gas emissions. Through targeted education, smart choices, and community action, we can accelerate the transition to net-zero sustainability!`;
  }
}
