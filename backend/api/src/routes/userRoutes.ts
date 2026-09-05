import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticate, UserController.getMe);
router.patch('/me', authenticate, UserController.updateMe);

router.get('/:id', authenticate, UserController.getUserById);
router.get('/:id/profile', authenticate, UserController.getUserProfile);
router.patch('/:id/profile', authenticate, UserController.updateUserProfile);

router.get('/:id/points', authenticate, UserController.getUserPoints);
router.get('/:id/badges', authenticate, UserController.getUserBadges);
router.get('/:id/progress-summary', authenticate, UserController.getProgressSummary);

export default router;
