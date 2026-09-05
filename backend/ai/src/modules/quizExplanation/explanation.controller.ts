import { Request, Response, NextFunction } from 'express';
import { ExplanationService } from './explanation.service';

export class ExplanationController {
  static async explain(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, question, userAnswer, correctAnswer } = req.body;
      if (!question || !userAnswer || !correctAnswer) {
        return res.status(400).json({ error: { message: 'Missing required quiz fields', code: 'INVALID_INPUT' } });
      }

      const result = await ExplanationService.explainQuiz(userId || 'anonymous', question, userAnswer, correctAnswer);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
