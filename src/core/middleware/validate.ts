import { NextFunction, Request, Response } from 'express';
import { create, Struct, StructError } from 'superstruct';

type ValidationType = 'body' | 'query';

const validate = <T, Type extends ValidationType>(schema: Struct<T>, type: Type) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = type === 'body' ? req.body : req.query;
      const validated = create(data, schema);

      if (type === 'body') {
        req.body = validated;
      } else {
        req.validatedQuery = validated;
      }

      next();
    } catch (error) {
      if (error instanceof StructError) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
};

export const validateBody = <T>(schema: Struct<T>) => validate(schema, 'body');
export const validateQuery = <T>(schema: Struct<T>) => validate(schema, 'query');
