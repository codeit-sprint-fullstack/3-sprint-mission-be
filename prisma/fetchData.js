import { PrismaClient } from '@prisma/client';
import fs from "fs";

const prisma = new PrismaClient();

async function fetchAllData() {
  try {
    // 각 모델의 데이터 가져오기
    const articles = await prisma.article.findMany();
    const products = await prisma.product.findMany();
    const comments = await prisma.comment.findMany();

    // 데이터 확인
    console.log('Articles:', articles);
    console.log('Products:', products);
    console.log('Comments:', comments);

    // 필요하면 JSON 파일로 저장
    const allData = { articles, products, comments };
    fs.writeFileSync('./prisma/allData.json', JSON.stringify(allData, null, 2));
    console.log('모든 데이터가 allData.json 파일에 저장되었습니다.');
  } catch (error) {
    console.error('데이터 조회 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAllData();
