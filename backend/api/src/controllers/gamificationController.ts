import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { GamificationService } from '../services/gamificationService';
import { Mission } from '../models/Gamification';
import { AppError } from '../middleware/errorHandler';

export class GamificationController {
  static async logAction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, metadata } = req.body;
      const action = await GamificationService.logEcoAction(req.user!.id, type, metadata);
      return res.status(201).json({ action });
    } catch (error) {
      next(error);
    }
  }

  static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { scope, scopeId, limit, offset } = req.query;
      const entries = await GamificationService.getLeaderboard(
        (scope as any) || 'global',
        scopeId as string,
        limit ? parseInt(limit as string, 10) : 20,
        offset ? parseInt(offset as string, 10) : 0
      );
      return res.status(200).json({ leaderboard: entries });
    } catch (error) {
      next(error);
    }
  }

  static async getMissions(_req: Request, res: Response, next: NextFunction) {
    try {
      const missions = await GamificationService.getMissions();
      return res.status(200).json({ missions });
    } catch (error) {
      next(error);
    }
  }

  static async createMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const mission = await Mission.create({ ...req.body, createdBy: req.user!.id });
      return res.status(201).json({ mission });
    } catch (error) {
      next(error);
    }
  }

  static async joinMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const participant = await GamificationService.joinMission(req.user!.id, id);
      return res.status(200).json({ participant });
    } catch (error) {
      next(error);
    }
  }

  static async getUserMissions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userMissions = await GamificationService.getUserMissions(req.user!.id);
      return res.status(200).json({ userMissions });
    } catch (error) {
      next(error);
    }
  }
}
