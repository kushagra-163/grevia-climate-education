import { LlmClient } from '../../config/llmClient';
import { PromptBuilders } from '../../utils/promptBuilders';

export class ExplanationService {
  static async explainQuiz(userId: string, question: string, userAnswer: string, correctAnswer: string) {
    const prompt = PromptBuilders.buildQuizExplanationPrompt(question, userAnswer, correctAnswer);
    const messages = [{ role: 'user' as const, content: `Explain question: "${question}"` }];
    const explanation = await LlmClient.completion(messages, prompt);
    return {
      explanation,
      userId,
      question,
    };
  }
}
