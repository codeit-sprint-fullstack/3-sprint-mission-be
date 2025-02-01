declare global {
  namespace Express {
    interface Request {
      validatedQuery?: any;
      user?: {
        userId: number;
      };
    }
  }
}

export {};
