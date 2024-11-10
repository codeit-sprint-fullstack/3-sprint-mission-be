import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { RequestHandler, Response, Request } from 'express';

export const asyncHandler = (
  handler: (req: Request, res: Response) => Promise<void>
): RequestHandler => {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (e: any) {
      if (
        e.name === 'StructError' ||
        e instanceof PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
};
