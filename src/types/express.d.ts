interface PageBaseQuery {
  page: number;
  pageSize: number;
  keyword?: string;
}

type ProductsQuery = PageBaseQuery & {
  orderBy: 'recent' | 'favorite';
};

type ArticleQuery = PageBaseQuery & {
  orderBy: 'recent' | 'like';
};

interface TakeQuery {
  take: number;
  cursor?: number;
}

type ValidatedQuery = ProductQuery | ArticleQuery | TakeQuery;

declare global {
  namespace Express {
    interface Request {
      validatedQuery: ValidatedQuery;
      user?: {
        userId: number;
      };
    }
  }
}

export {};
