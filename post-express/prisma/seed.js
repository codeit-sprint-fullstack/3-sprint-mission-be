import { PrismaClient } from "@prisma/client";
import {ARTICLE, ARTICLECOMMENT} from "./Mock/article.js";

const prisma = new PrismaClient();

async function main() {
    await prisma.article.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.productComment.deleteMany();
    await prisma.articleComment.deleteMany();

    await prisma.article.createMany({
      data: ARTICLE,
      skipDuplicates: true,
    });

    // await prisma.article.createMany({
    //   data:PRODUCT,
    //   skipDuplicates:true,
    // });

    await prisma.articleComment.createMany({
      data: ARTICLECOMMENT,
      skipDuplicates:true,
    });

    // await prisma.article.createMany({
    //   data:PRODUCTCOMMENT,
    //   skipDuplicates:true,
    // });

    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Article"', 'id'), (SELECT MAX(id) FROM "Article"))`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"ArticleComment"', 'id'), (SELECT MAX(id) FROM "ArticleComment"))`;
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("success");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
