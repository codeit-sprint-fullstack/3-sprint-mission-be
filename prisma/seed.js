import { PrismaClient } from '@prisma/client';
import { ArticleMocks } from './mocks/articleMocks.js';
import { ProductMocks } from './mocks/productMocks.js';
import { CommentMocks } from './mocks/comments.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.comment.deleteMany();

  // 목 데이터 삽입
  await prisma.article.createMany({
    data: ArticleMocks,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: ProductMocks,
    skipDuplicates: true,
  });
  await prisma.comment.createMany({
    data: CommentMocks,
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
