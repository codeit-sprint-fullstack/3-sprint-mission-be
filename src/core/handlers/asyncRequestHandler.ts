import { Request, Response, NextFunction } from 'express';
import type { AsyncRequestHandler } from '@/types/asyncRequestHandler.types';
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
      if (!res.headersSent) {
        if (
          e instanceof PrismaClientValidationError ||
          e instanceof PrismaClientKnownRequestError
        ) {
          handlePrismaError(e, res);
        } else if (e.name === 'ValidationError' || e.name === 'StructError') {
          res.status(400).send({ message: e.message });
        } else if (e.statusCode) {
          res.status(e.statusCode).send({ message: e.message });
        } else {
          res.status(500).send({ message: e.message });
        }
      }
    }
  };
};

export default asyncRequestHandler;
