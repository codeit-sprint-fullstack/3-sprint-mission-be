import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** 
 * 파라미터로 startups, offset, limit 받아서 페이지네이션에 필요한 데이터를 추출하여 responseData 반환
*/
const productsPaginationHandler = async (
  product, offsetNum, limitNum) => {
  
  const totalProducts = await prisma.product.count();
  const currentPage = Math.floor(offsetNum / limitNum) + 1;
  const totalPages = Math.ceil(totalProducts / limitNum);
  const hasNextPage = offsetNum + limitNum < totalProducts;
  const responseData = { totalProducts, currentPage, product, totalPages, hasNextPage };
  return responseData;
}

const articlesPaginationHandler = async (
  article, offsetNum, limitNum) => {
  
  const totalArticles = await prisma.article.count();
  const currentPage = Math.floor(offsetNum / limitNum) + 1;
  const totalPages = Math.ceil(totalArticles / limitNum);
  const hasNextPage = offsetNum + limitNum < totalArticles;
  const responseData = { totalArticles, currentPage, article, totalPages, hasNextPage };
  return responseData;
}

export {productsPaginationHandler, articlesPaginationHandler};