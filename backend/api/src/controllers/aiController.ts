import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AiClientService } from '../services/aiClientService';

export class AiController {
  static async chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { messages, context } = req.body;
      const result = await AiClientService.chat(req.user!.id, messages, context);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async quizExplanation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { question, userAnswer, correctAnswer } = req.body;
      const result = await AiClientService.quizExplanation(req.user!.id, question, userAnswer, correctAnswer);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async habitSuggestions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { timeframe } = req.body;
      const result = await AiClientService.habitSuggestions(req.user!.id, timeframe || 'daily');
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
