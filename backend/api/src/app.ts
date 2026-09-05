import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import lessonRoutes from './routes/lessonRoutes';
import quizRoutes from './routes/quizRoutes';
import aiRoutes from './routes/aiRoutes';
import gamificationRoutes from './routes/gamificationRoutes';
import climateRoutes from './routes/climateRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

import { generalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser() as any);
app.use(generalRateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'grevia-api', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', gamificationRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/analytics', analyticsRoutes);

// Centralized error handler
app.use(errorHandler as any);

export default app;
