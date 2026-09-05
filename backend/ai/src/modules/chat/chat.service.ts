import { LlmClient, ChatMessage } from '../../config/llmClient';
import { PromptBuilders } from '../../utils/promptBuilders';

export class ChatService {
  static async handleChat(userId: string, messages: ChatMessage[], context?: any) {
    const systemPrompt = PromptBuilders.buildEcoCoachPrompt(context);
    const reply = await LlmClient.completion(messages, systemPrompt);
    return {
      reply,
      userId,
      timestamp: new Date(),
    };
  }
}
