import { Router } from 'express';
import { LessonController } from '../controllers/lessonController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', LessonController.getLessons);
router.get('/personalized/path', authenticate, LessonController.getPersonalizedPath);
router.get('/:id', LessonController.getLessonById);

router.post('/', authenticate, authorize(['admin']), LessonController.createLesson);
router.patch('/:id', authenticate, authorize(['admin']), LessonController.updateLesson);

export default router;
