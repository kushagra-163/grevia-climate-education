import { LlmClient } from '../../config/llmClient';
import { PromptBuilders } from '../../utils/promptBuilders';

export class HabitService {
  static async getSuggestions(userId: string, timeframe = 'daily', context?: any) {
    const prompt = PromptBuilders.buildHabitSuggestionPrompt(timeframe, context);
    const messages = [{ role: 'user' as const, content: `Provide ${timeframe} habit suggestions.` }];
    const text = await LlmClient.completion(messages, prompt);

    return {
      timeframe,
      rawText: text,
      suggestions: [
        {
          id: 'habit-1',
          title: 'Eco Commute Challenge',
          impact: 'High',
          description: 'Use public transit, bicycle, or walk for your primary trips today.',
          co2SavedKg: 2.5,
        },
        {
          id: 'habit-2',
          title: 'Zero Waste Lunch',
          impact: 'Medium',
          description: 'Pack a reusable container and water bottle to avoid single-use plastics.',
          co2SavedKg: 0.8,
        },
        {
          id: 'habit-3',
          title: 'Energy Vampire Hunt',
          impact: 'Low',
          description: 'Turn off standby power strips and unused lights around your home or school.',
          co2SavedKg: 1.2,
        },
      ],
    };
  }
}
