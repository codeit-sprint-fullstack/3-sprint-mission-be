import { Prisma } from '@prisma/client';
import { userMocks } from '../data/userMocks';

export const mockUser = async (tx: Prisma.TransactionClient) => {
  await tx.user.createMany({
    data: userMocks,
    skipDuplicates: true,
  });
};
