import { Router } from 'express';
import { AiController } from '../controllers/aiController';
import { authenticate } from '../middleware/authMiddleware';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/chat', authenticate, aiRateLimiter, AiController.chat);
router.post('/quiz-explanation', authenticate, aiRateLimiter, AiController.quizExplanation);
router.post('/habit-suggestions', authenticate, aiRateLimiter, AiController.habitSuggestions);

export default router;
