import { Request, Response, NextFunction } from 'express';
import { AsyncRequestHandler } from '../types/asyncRequestHandler';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { handlePrismaError } from './handlePrismaError';

const asyncRequestHandler = <T>(handler: AsyncRequestHandler<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e: any) {
      if (
        e.name === 'StructError' ||
        e instanceof PrismaClientValidationError ||
        e instanceof PrismaClientKnownRequestError
      ) {
        handlePrismaError(e, res);
      } else if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
};

export default asyncRequestHandler;
