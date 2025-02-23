import { PrismaClient } from '@prisma/client';

export const prismaTestClient = new PrismaClient();

beforeAll(async () => {
  await prismaTestClient.$connect();
});

afterAll(async () => {
  await prismaTestClient.$disconnect();
});
