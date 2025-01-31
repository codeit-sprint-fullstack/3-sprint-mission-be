import { Request, Response } from 'express';
import { signInRequestStruct, signUpValidator } from '../../structs/AuthStruct';
import { create } from 'superstruct';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../utils/jwt';
import User from '../../models/user';
import UserRepository from '../../repositories/userRepository';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const userRepository = new UserRepository();

export const signUp = async (req: Request, res: Response) => {
  const { email, nickname, encryptedPassword: password } = create(req.body, signUpValidator);

  const existingUserByEmail = await userRepository.findByEmail(email);

  if (existingUserByEmail)
    return res.status(409).json({ message: EXCEPTION_MESSAGES.duplicatedEmail });

  const existingUserByNickname = await userRepository.findByNickname(nickname);

  if (existingUserByNickname)
    return res.status(409).json({ message: EXCEPTION_MESSAGES.duplicatedNickname });

  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  const userEntity = await userRepository.create({
    email,
    nickname,
    encryptedPassword,
  });
  const user = new User(userEntity);
  const tokens = generateTokens(user.getId());

  return res.status(201).json({
    ...tokens,
    user: user.toJSON(),
  });
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = create(req.body, signInRequestStruct);

  const userEntity = await userRepository.findByEmail(email);

  if (!userEntity) return res.status(401).json({ message: AUTH_MESSAGES.emailNotExist });

  const isPasswordValid = await bcrypt.compare(password, userEntity?.encryptedPassword);
  if (!isPasswordValid) return res.status(401).json({ message: AUTH_MESSAGES.invalidPassword });

  const user = new User(userEntity);
  const tokens = generateTokens(user.getId());

  return res.status(201).json({
    ...tokens,
    user: user.toJSON(),
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: AUTH_MESSAGES.needRefreshToken });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
    return res.status(201).json(generateTokens(decoded.userId));
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: AUTH_MESSAGES.refreshTokenExpired });
    }

    return res.status(401).json({ message: AUTH_MESSAGES.invalidRefreshToken });
  }
};
