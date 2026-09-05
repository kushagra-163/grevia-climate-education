import { Router } from 'express';
import { GamificationController } from '../controllers/gamificationController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/actions/log', authenticate, GamificationController.logAction);
router.get('/leaderboard', GamificationController.getLeaderboard);

router.get('/missions', GamificationController.getMissions);
router.post('/missions', authenticate, authorize(['teacher', 'admin']), GamificationController.createMission);
router.post('/missions/:id/join', authenticate, GamificationController.joinMission);
router.get('/missions/user/status', authenticate, GamificationController.getUserMissions);

export default router;
