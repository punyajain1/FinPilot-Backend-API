import { Router } from 'express';
import portfolioRoutes from './portfolio.routes';
import newsRoutes from './news.routes';
import chatRoutes from './chat.routes';
import usersRoutes from './users.routes';
import marketRoutes from './market.routes';
import simulationRoutes from './simulation.routes';
import indiaRoutes from './india.routes';
import derivativesRoutes from './derivatives.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Trading Agent API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/portfolio', portfolioRoutes);
router.use('/news', newsRoutes);
router.use('/chat', chatRoutes);
router.use('/users', usersRoutes);
router.use('/market', marketRoutes);
router.use('/simulation', simulationRoutes);
router.use('/india', indiaRoutes);
router.use('/derivatives', derivativesRoutes);

export default router;
