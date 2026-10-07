import { Router } from 'express';
import simulationController from '../controllers/simulation.controller';

const router = Router();

// GET /api/simulation/dca
router.get('/dca', simulationController.getDcaSimulation);

export default router;
