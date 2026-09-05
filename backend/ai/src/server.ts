import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';

import { ChatController } from './modules/chat/chat.controller';
import { ExplanationController } from './modules/quizExplanation/explanation.controller';
import { HabitController } from './modules/habitSuggestions/habit.controller';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Internal Authentication Middleware
const verifyInternalSecret = (req: Request, res: Response, next: NextFunction) => {
  const secret = req.headers['x-ai-service-secret'];
  if (secret !== env.AI_SERVICE_SECRET && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: { message: 'Unauthorized internal service request', code: 'UNAUTHORIZED' } });
  }
  next();
};

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'grevia-ai', timestamp: new Date() });
});

// Internal AI Endpoints
app.post('/internal/ai/chat', verifyInternalSecret, ChatController.chat);
app.post('/internal/ai/quiz-explanation', verifyInternalSecret, ExplanationController.explain);
app.post('/internal/ai/habit-suggestions', verifyInternalSecret, HabitController.suggest);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Grevia AI Error]', err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'AI Service Error',
      code: err.code || 'AI_SERVICE_ERROR',
    },
  });
});

const PORT = parseInt(env.AI_PORT, 10);
app.listen(PORT, () => {
  console.log(`[Grevia AI Microservice] Listening on port ${PORT} (${env.NODE_ENV})`);
});

export default app;
