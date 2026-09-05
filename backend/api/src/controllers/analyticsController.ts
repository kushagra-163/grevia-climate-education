import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/analyticsService';

export class AnalyticsController {
  static async getUserAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req.params.id as string) || req.user!.id;
      const analytics = await AnalyticsService.getUserAnalytics(userId);
      return res.status(200).json({ analytics });
    } catch (error) {
      next(error);
    }
  }

  static async getClassAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = req.params.classId as string;
      const analytics = await AnalyticsService.getClassAnalytics(classId);
      return res.status(200).json({ analytics });
    } catch (error) {
      next(error);
    }
  }

  static async getCommunityAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await AnalyticsService.getCommunityAnalytics();
      return res.status(200).json({ analytics });
    } catch (error) {
      next(error);
    }
  }
}
