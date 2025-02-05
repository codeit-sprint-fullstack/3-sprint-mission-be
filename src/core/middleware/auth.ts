import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
}

export const createAuthMiddleware = (message: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res.status(401).json({ message });
      return;
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
      req.user = { userId: decoded.userId };
      next();
    } catch (err) {
      res.status(403).json({ message: '다시 로그인해 주세요.' });
      return;
    }
  };
};
