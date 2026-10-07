import { Router } from 'express';
import { getGlobalMarketData } from '../controllers/market.controller';

const router = Router();

router.get('/global', getGlobalMarketData);

export default router;
