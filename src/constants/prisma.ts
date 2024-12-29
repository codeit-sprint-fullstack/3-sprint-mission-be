import { Prisma } from '@prisma/client';

export const INCLUDE_USER_CLAUSE = {
  user: true,
} as const;

export const getIncludeFavoriteClause = (userId: number) => {
  return {
    favorites: userId
      ? {
          where: {
            userId,
          },
        }
      : false,
  };
};

export const getOrderByClause = (orderBy: string) =>
  ({
    recent: { createdAt: Prisma.SortOrder.desc },
    old: { createdAt: Prisma.SortOrder.asc },
    favorite: { favoriteCount: Prisma.SortOrder.desc },
    like: { likeCount: Prisma.SortOrder.desc },
  })[orderBy];

export const getWhereByWord = (word: string | undefined) => {
  return word
    ? {
        OR: [
          {
            title: {
              contains: word,
            },
          },
          {
            content: {
              contains: word,
            },
          },
        ],
      }
    : undefined;
};
