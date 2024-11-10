import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productComment.deleteMany();
    await prisma.articleComment.deleteMany();
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
