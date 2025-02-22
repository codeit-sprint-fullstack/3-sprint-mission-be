import { Prisma } from '@prisma/client';
import { productCommentMocks } from '../data/commentMocks';
import { favoriteMocks } from '../data/favoriteMocks';
import { productMocks } from '../data/productMocks';

export const mockProduct = async (tx: Prisma.TransactionClient) => {
  await tx.product.createMany({
    data: productMocks,
    skipDuplicates: true,
  });
  await tx.favorite.createMany({
    data: favoriteMocks,
    skipDuplicates: true,
  });
  await tx.comment.createMany({
    data: productCommentMocks,
    skipDuplicates: true,
  });
};
