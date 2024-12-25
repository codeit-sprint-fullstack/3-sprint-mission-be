import { PrismaClient } from "@prisma/client";
import { MockData } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 목 데이터 삽입
  await prisma.article.createMany({
    data: MockData,
    skipDuplicates: true,
  });
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
