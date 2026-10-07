import { Router } from 'express';
import * as derivativesController from '../controllers/derivatives.controller';

const router = Router();
router.get('/:symbol', derivativesController.getDerivatives);

export default router;
