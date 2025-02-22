import { Prisma } from '@prisma/client';

export const clearMocks = async (tx: Prisma.TransactionClient) => {
  await tx.comment.deleteMany();
  await tx.like.deleteMany();
  await tx.favorite.deleteMany();
  await tx.article.deleteMany();
  await tx.product.deleteMany();
  await tx.user.deleteMany();
};
