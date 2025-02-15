import UserRepository from '../../repositories/userRepository';
import { AuthController } from './controller';
import { AuthService } from './service';
import express from 'express';
import asyncRequestHandler from '../../core/handlers/asyncRequestHandler';
import { validateBody } from '../../core/middleware/validate';
import { signInRequestStruct, SignUpRequestStruct } from '../../structs/authStruct';
import { prismaClient } from '../../prismaClient';

const router = express.Router();
const userRepository = new UserRepository(prismaClient);
const authService = new AuthService(userRepository, process.env.REFRESH_TOKEN_SECRET!);
const authController = new AuthController(authService);

const { signUp, signIn, refreshUserToken } = authController;

router.post('/sign-up', validateBody(SignUpRequestStruct), asyncRequestHandler(signUp));
router.post('/sign-in', validateBody(signInRequestStruct), asyncRequestHandler(signIn));
router.post('/refresh-token', asyncRequestHandler(refreshUserToken));

export default router;
