import { PrismaClient } from "@prisma/client";
import { ProductsMockData } from "./mocks/productsMock.js";

const prisma = new PrismaClient();

async function main() { 
  // 기존 데이터 삭제
  await prisma.product.deleteMany();
  
  // 목 데이터 삽입
  await prisma.product.createMany({
    data: ProductsMockData,
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
console.log("success");
