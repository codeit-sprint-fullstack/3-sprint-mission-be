const { PrismaClient } = require('@prisma/client');
import { articleMocks } from './mocks/articleMocks';
import { productMocks } from './mocks/productMocks';
import { productCommentMocks } from './mocks/commentMocks';
import { articleCommentMocks } from './mocks/commentMocks';
import { userMocks } from './mocks/userMocks';
import { favoriteMocks } from './mocks/favoriteMocks';
import { likeMocks } from './mocks/likeMocks';

async function main(prisma: typeof PrismaClient) {
  await prisma.favorite.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: userMocks,
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: articleMocks,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: productMocks,
    skipDuplicates: true,
  });
  await prisma.comment.createMany({
    data: [...productCommentMocks, ...articleCommentMocks],
    skipDuplicates: true,
  });
  await prisma.favorite.createMany({
    data: favoriteMocks,
    skipDuplicates: true,
  });
  await prisma.like.createMany({
    data: likeMocks,
    skipDuplicates: true,
  });
}
if (require.main === module) {
  const prisma = new PrismaClient();
  main(prisma)
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export default main;
