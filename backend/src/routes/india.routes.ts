import { Router } from 'express';
import * as indiaController from '../controllers/india.controller';

const router = Router();

router.get('/premium/:symbol', indiaController.getPremium);
router.get('/rank/:symbol', indiaController.getRanks);
router.post('/tax-preview', indiaController.previewTax);

export default router;
