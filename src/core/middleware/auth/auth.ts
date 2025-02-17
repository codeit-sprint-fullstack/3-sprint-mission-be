import { NextFunction, Request, Response } from 'express';

export const createAuthMiddleware = (message: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) res.status(401).json({ message });
    next();
  };
};
