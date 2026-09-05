import { Request, Response, NextFunction } from 'express';
import { HabitService } from './habit.service';

export class HabitController {
  static async suggest(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, timeframe, context } = req.body;
      const result = await HabitService.getSuggestions(userId || 'anonymous', timeframe || 'daily', context);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
