import { Router } from 'express';
import { createAuthMiddleware } from '../../middleware/auth';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { getMe } from './Service';

const router = Router();

router.get('/me', createAuthMiddleware(''), asyncRequestHandler(getMe));

export default router;
