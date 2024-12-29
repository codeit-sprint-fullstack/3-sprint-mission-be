import { Request, Response } from 'express';
import UserRepository from '../../repositories/userRepository';
import User from '../../models/user';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const userRepository = new UserRepository();

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const userEntity = await userRepository.findById(userId);

  if (!userEntity) return res.status(401).json({ message: AUTH_MESSAGES.needLogin });

  const user = new User(userEntity);
  return res.status(201).json(user);
};
