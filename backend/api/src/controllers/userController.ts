import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import { GamificationService } from '../services/gamificationService';

export class UserController {
  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.user!.id);
      const profile = await UserService.getUserProfile(req.user!.id);
      const skillProfile = await UserService.getSkillProfiles(req.user!.id);
      return res.status(200).json({ user, profile, skillProfile });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateUser(req.user!.id, req.body);
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await UserService.getUserById(id);
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const profile = await UserService.getUserProfile(id);
      return res.status(200).json({ profile });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const profile = await UserService.updateUserProfile(id, req.body);
      return res.status(200).json({ profile });
    } catch (error) {
      next(error);
    }
  }

  static async getUserPoints(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await UserService.getUserById(id);
      return res.status(200).json({ points: user.points });
    } catch (error) {
      next(error);
    }
  }

  static async getUserBadges(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const badges = await GamificationService.evaluateBadges(id);
      return res.status(200).json({ badges });
    } catch (error) {
      next(error);
    }
  }

  static async getProgressSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await UserService.getUserById(id);
      const profile = await UserService.getUserProfile(id);
      const skillProfiles = await UserService.getSkillProfiles(id);
      const badges = await GamificationService.evaluateBadges(id);

      return res.status(200).json({
        user: { name: user.name, points: user.points, role: user.role },
        profile,
        skillProfiles,
        badges,
      });
    } catch (error) {
      next(error);
    }
  }
}
