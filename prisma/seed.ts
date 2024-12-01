const { PrismaClient } = require('@prisma/client');
import { Product } from '@prisma/client';
import { articleMocks } from './mocks/articleMocks';
import { productMocks } from './mocks/productMocks';

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.comment.deleteMany();

  await prisma.article.createMany({
    data: articleMocks,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: productMocks,
    skipDuplicates: true,
  });

  const products = await prisma.article.findMany();
  const productIds = products.map((product: Product) => product.id);
  const commentMocks = productIds.map((id: Product, index: number) => ({
    content: `테스트 내용 ${index}`,
    articleId: id,
  }));
  await prisma.comment.createMany({
    data: commentMocks,
    skipDuplicates: true,
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
