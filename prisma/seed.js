import { PrismaClient } from '@prisma/client';
import { Products, Articles, ProductComments, ArticleComments } from './mock.js';

const prisma = new PrismaClient();

async function main() {
    // 기존 데이터 삭제
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
    await prisma.productComment.deleteMany();
    await prisma.articleComment.deleteMany();

    // 목 데이터 삽입
    await prisma.product.createMany({
        data: Products,
        skipDuplicates: true,
    });

    await prisma.article.createMany({
        data: Articles,
        skipDuplicates: true,
    });

    await prisma.productComment.createMany({
        data: ProductComments,
    });

    await prisma.articleComment.createMany({
        data: ArticleComments,
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

