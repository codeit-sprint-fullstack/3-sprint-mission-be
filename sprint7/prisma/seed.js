import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "./mocks/productsMock.js";
import { ARTICLES } from "./mocks/articlesMock.js";
import { COMMENTS } from "./mocks/commentsMock.js";
// import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() { 

//   const TEST_DATA = [];

//   for (let i = 0; i < 10; i++) {
//     TEST_DATA.push({
//       name: faker.commerce.productName(),
//       avatar: faker.image.avatar(),
//       description: faker.commerce.productDescription(),
//       price: faker.commerce.price(),
//       tags: faker.commerce.productAdjective(),

//       _id: faker.string.uuid(),
//       avatar: faker.image.avatar(),
//       birthday: faker.date.birthdate(),
//       email: faker.internet.email(),
//       firstName: faker.person.firstName(),
//       lastName: faker.person.lastName(),
//       sex: faker.person.sexType(),
//       subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
//     });
//   }
// console.log(TEST_DATA);

  // // 기존 데이터 삭제
  // await prisma.product.deleteMany();
  // await prisma.article.deleteMany();
  await prisma.comment.deleteMany(); // article(id) 데이터 삭제되면 comment 데이터 못 씀(유지하기). 
  // 목 데이터 삽입
  // await prisma.product.createMany({
  //   data: PRODUCTS,
  //   skipDuplicates: true,
  // });
  // await prisma.article.createMany({
  //   data: ARTICLES,
  //   skipDuplicates: true,
  // });
  await prisma.comment.createMany({
    data: COMMENTS,
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
