import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { LearningService } from '../services/learningService';

export class LessonController {
  static async getLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, level, language } = req.query;
      const lessons = await LearningService.getLessons({
        topic: topic as any,
        level: level as any,
        language: language as string,
      });
      return res.status(200).json({ lessons });
    } catch (error) {
      next(error);
    }
  }

  static async getPersonalizedPath(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const path = await LearningService.getPersonalizedLearningPath(userId);
      return res.status(200).json(path);
    } catch (error) {
      next(error);
    }
  }

  static async getLessonById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const lesson = await LearningService.getLessonById(id);
      return res.status(200).json({ lesson });
    } catch (error) {
      next(error);
    }
  }

  static async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LearningService.createLesson(req.body);
      return res.status(201).json({ lesson });
    } catch (error) {
      next(error);
    }
  }

  static async updateLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const lesson = await LearningService.updateLesson(id, req.body);
      return res.status(200).json({ lesson });
    } catch (error) {
      next(error);
    }
  }
}
