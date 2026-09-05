import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/user/:id', authenticate, AnalyticsController.getUserAnalytics);
router.get('/class/:classId', authenticate, AnalyticsController.getClassAnalytics);
router.get('/community', AnalyticsController.getCommunityAnalytics);

export default router;
