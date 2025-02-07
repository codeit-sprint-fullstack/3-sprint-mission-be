import { Router } from 'express';
import asyncRequestHandler from '../../core/handlers/asyncRequestHandler';
import { UserService } from './service';
import { UserController } from './controller';
import UserRepository from '../../repositories/userRepository';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/me', asyncRequestHandler(userController.getMe));

export default router;
