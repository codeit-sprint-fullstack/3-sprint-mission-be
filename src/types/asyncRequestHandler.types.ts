import { Request, Response, NextFunction } from 'express';

export type AsyncRequestHandler<T> = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => Promise<T>;
