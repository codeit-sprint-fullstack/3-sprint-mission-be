import express from 'express';
import { refreshToken, signIn, signUp } from './service';
import asyncRequestHandler from '../../utils/asyncRequestHandler';

const router = express.Router();

router.post('/sign-up', asyncRequestHandler(signUp));
router.post('/sign-in', asyncRequestHandler(signIn));
router.post('/refresh-token', asyncRequestHandler(refreshToken));

export default router;
