import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { QuizService } from '../services/quizService';
import { UserService } from '../services/userService';

export class QuizController {
  static async generateQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { topic, difficulty, numQuestions } = req.body;
      const quiz = await QuizService.generateQuiz({
        userId: req.user!.id,
        topic,
        difficulty,
        numQuestions,
      });

      const sanitized = QuizService.sanitizeQuizForDisplay(quiz);
      return res.status(201).json({ quiz: sanitized });
    } catch (error) {
      next(error);
    }
  }

  static async getQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.quizId as string;
      const quiz = await QuizService.getQuizById(quizId);
      const sanitized = QuizService.sanitizeQuizForDisplay(quiz);
      return res.status(200).json({ quiz: sanitized });
    } catch (error) {
      next(error);
    }
  }

  static async submitQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.quizId as string;
      const { answers, responseTimes } = req.body;
      const result = await QuizService.submitQuiz(req.user!.id, quizId, {
        answers,
        responseTimes,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserQuizHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req.params.id as string) || req.user!.id;
      const history = await QuizService.getUserQuizHistory(userId);
      return res.status(200).json({ history });
    } catch (error) {
      next(error);
    }
  }

  static async getUserSkillProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req.params.id as string) || req.user!.id;
      const skillProfiles = await UserService.getSkillProfiles(userId);
      return res.status(200).json({ skillProfiles });
    } catch (error) {
      next(error);
    }
  }
}
