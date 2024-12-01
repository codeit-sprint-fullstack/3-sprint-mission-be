import { Request, Response, NextFunction } from 'express';
import { AsyncRequestHandler } from '../types/asyncRequestHandler';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

const asyncRequestHandler = <T>(handler: AsyncRequestHandler<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e: any) {
      if (e.name === 'StructError' || e instanceof PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
};

export default asyncRequestHandler;
