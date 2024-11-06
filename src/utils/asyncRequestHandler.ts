import { Request, Response, NextFunction } from 'express';
import { AsyncRequestHandler } from '../types/asyncRequestHandler';

const asyncRequestHandler = <T>(handler: AsyncRequestHandler<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e: any) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
};

export default asyncRequestHandler;
