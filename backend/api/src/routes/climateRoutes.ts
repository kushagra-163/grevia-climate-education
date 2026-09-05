import { Router } from 'express';
import { ClimateController } from '../controllers/climateController';

const router = Router();

router.get('/current', ClimateController.getCurrent);
router.get('/trends', ClimateController.getTrends);

export default router;
