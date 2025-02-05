import { Router } from 'express';
import { createAuthMiddleware } from '../../core/middleware/auth';
import asyncRequestHandler from '../../core/handlers/asyncRequestHandler';
import { UserService } from './service';
import { UserController } from './controller';
import UserRepository from '../../repositories/userRepository';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get(
  '/me',
  createAuthMiddleware(AUTH_MESSAGES.needLogin),
  asyncRequestHandler(userController.getMe),
);

export default router;
