import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.article.createMany({
    data: a[
      { title: "게시글1", content: "안녕하세요" },
      { title: "게시글2", content: "맥북 vs 그램" }
    ]
  });

  await prisma.marketplace.createMany({
    data: [
      { title: "중고 판매1", content: "강태진이 녹차쏟은 맥북" },
      { title: "중고 판매2", content: "강태진이 착용한 공주 귀걸이" }
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });