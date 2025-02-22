import { Prisma } from '@prisma/client';
import { articleMocks } from '../data/articleMocks';
import { articleCommentMocks } from '../data/commentMocks';
import { likeMocks } from '../data/likeMocks';

export const mockArticle = async (tx: Prisma.TransactionClient) => {
  await tx.article.createMany({
    data: articleMocks,
    skipDuplicates: true,
  });
  await tx.like.createMany({
    data: likeMocks,
    skipDuplicates: true,
  });
  await tx.comment.createMany({
    data: articleCommentMocks,
    skipDuplicates: true,
  });
};
