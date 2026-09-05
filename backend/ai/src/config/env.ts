import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  AI_PORT: z.string().default('3002'),
  AI_SERVICE_SECRET: z.string().default('grevia_internal_ai_secret_key_2026'),
  LLM_API_KEY: z.string().optional().default(''),
  LLM_BASE_URL: z.string().default('https://api.openai.com/v1'),
  LLM_MODEL: z.string().default('gpt-3.5-turbo'),
});

export const env = envSchema.parse(process.env);
