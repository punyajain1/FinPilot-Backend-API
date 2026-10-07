import { Router } from 'express';
import { syncProfile } from '../controllers/users.controller';

const router = Router();

router.post('/sync-profile', syncProfile);

export default router;
