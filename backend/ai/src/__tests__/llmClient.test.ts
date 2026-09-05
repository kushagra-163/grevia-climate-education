import { describe, it, expect } from 'vitest';
import { LlmClient } from '../config/llmClient';

describe('AI Microservice LLM Client Tests', () => {
  it('should return deterministic mock response when LLM_API_KEY is unconfigured', async () => {
    const response = await LlmClient.completion([
      { role: 'user', content: 'What is climate change?' },
    ]);

    expect(response).toBeDefined();
    expect(response).toContain('Grevia Eco-Coach');
  });

  it('should return habit suggestion mock for habit query', async () => {
    const response = await LlmClient.completion([
      { role: 'user', content: 'Suggest daily sustainable habits' },
    ]);

    expect(response).toContain('Recommended Climate Action');
  });
});
