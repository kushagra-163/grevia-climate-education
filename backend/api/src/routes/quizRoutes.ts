import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/generate', authenticate, QuizController.generateQuiz);
router.get('/:quizId', authenticate, QuizController.getQuiz);
router.post('/:quizId/submit', authenticate, QuizController.submitQuiz);

router.get('/user/:id/history', authenticate, QuizController.getUserQuizHistory);
router.get('/user/:id/skills', authenticate, QuizController.getUserSkillProfile);

export default router;
