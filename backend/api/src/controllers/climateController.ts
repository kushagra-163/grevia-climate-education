import { Request, Response, NextFunction } from 'express';
import { ClimateService } from '../services/climateService';

export class ClimateController {
  static async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const location = (req.query.location as string) || 'Berlin';
      const country = req.query.country as string | undefined;
      const climate = await ClimateService.getCurrentClimate(location, country);
      return res.status(200).json({ climate });
    } catch (error) {
      next(error);
    }
  }

  static async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const location = (req.query.location as string) || 'Berlin';
      const country = req.query.country as string | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const trends = await ClimateService.getClimateTrends(location, days, country);
      return res.status(200).json({ trends });
    } catch (error) {
      next(error);
    }
  }
}
