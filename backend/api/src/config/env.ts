import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3001'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/grevia'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().default('grevia_super_secret_access_key_2026'),
  JWT_REFRESH_SECRET: z.string().default('grevia_super_secret_refresh_key_2026'),
  AI_SERVICE_URL: z.string().default('http://localhost:3002'),
  AI_SERVICE_SECRET: z.string().default('grevia_internal_ai_secret_key_2026'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  NASA_POWER_BASE_URL: z.string().default('https://power.larc.nasa.gov/api/temporal/daily/point'),
  NASA_EONET_BASE_URL: z.string().default('https://eonet.gsfc.nasa.gov/api/v3/events'),
});

export const env = envSchema.parse(process.env);
