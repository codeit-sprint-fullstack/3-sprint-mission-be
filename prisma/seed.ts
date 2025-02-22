import { PrismaClient } from '@prisma/client';
import { mockUser } from '../src/mocks/service/mockUser';
import { mockProduct } from '../src/mocks/service/mockProduct';
import { mockArticle } from '../src/mocks/service/mockArticle';
import { clearMocks } from '../src/mocks/service/clearMocks';

const prismaClient = new PrismaClient();

async function main() {
  prismaClient.$transaction(async (tx) => {
    await clearMocks(tx);
    await mockUser(tx);
    await mockProduct(tx);
    await mockArticle(tx);
  });
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });

export default main;
