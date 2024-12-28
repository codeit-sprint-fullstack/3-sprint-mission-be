const { PrismaClient } = require('@prisma/client');
import { articleMocks } from './mocks/articleMocks';
import { productMocks } from './mocks/productMocks';
import { productCommentMocks } from './mocks/commentMocks';
import { articleCommentMocks } from './mocks/commentMocks';
import { userMocks } from './mocks/userMocks';
import { favoriteMocks } from './mocks/favoriteMocks';

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.comment.deleteMany();
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
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
