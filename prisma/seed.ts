import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'cm6pwa5610000wte4gt7fp2u7'; // 사용할 userId

  const products = [
    {
      name: '상품1',
      description: '상품1 설명',
      price: 10000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image1.jpg',
      tags: ['tag1', 'tag2'],
    },
    {
      name: '상품2',
      description: '상품2 설명',
      price: 20000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image2.jpg',
      tags: ['tag3', 'tag4'],
    },
    {
      name: '상품3',
      description: '상품3 설명',
      price: 30000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image3.jpg',
      tags: ['tag5', 'tag6'],
    },
    {
      name: '상품4',
      description: '상품4 설명',
      price: 40000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image4.jpg',
      tags: ['tag7', 'tag8'],
    },
    {
      name: '상품5',
      description: '상품5 설명',
      price: 50000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image5.jpg',
      tags: ['tag9', 'tag10'],
    },
    {
      name: '상품6',
      description: '상품6 설명',
      price: 60000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image6.jpg',
      tags: ['tag11', 'tag12'],
    },
    {
      name: '상품7',
      description: '상품7 설명',
      price: 70000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image7.jpg',
      tags: ['tag13', 'tag14'],
    },
    {
      name: '상품8',
      description: '상품8 설명',
      price: 80000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image8.jpg',
      tags: ['tag15', 'tag16'],
    },
    {
      name: '상품9',
      description: '상품9 설명',
      price: 90000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image9.jpg',
      tags: ['tag17', 'tag18'],
    },
    {
      name: '상품10',
      description: '상품10 설명',
      price: 100000,
      like: 0,
      userId,
      imageUrl: 'https://example.com/image10.jpg',
      tags: ['tag19', 'tag20'],
    },
  ];

  const articles = [
    {
      title: '첫 번째 게시글',
      content: '이것은 첫 번째 게시글입니다.',
      imageUrl: 'https://example.com/article1.jpg',
      like: 0,
      userId,
    },
    {
      title: '두 번째 게시글',
      content: '이것은 두 번째 게시글입니다.',
      imageUrl: 'https://example.com/article2.jpg',
      like: 0,
      userId,
    },
    {
      title: '세 번째 게시글',
      content: '이것은 세 번째 게시글입니다.',
      imageUrl: 'https://example.com/article3.jpg',
      like: 0,
      userId,
    },
    {
      title: '네 번째 게시글',
      content: '이것은 네 번째 게시글입니다.',
      imageUrl: 'https://example.com/article4.jpg',
      like: 0,
      userId,
    },
    {
      title: '다섯 번째 게시글',
      content: '이것은 다섯 번째 게시글입니다.',
      imageUrl: 'https://example.com/article5.jpg',
      like: 0,
      userId,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        like: product.like,
        userId: product.userId,
        imageUrl: product.imageUrl,
        tags: product.tags,
      },
    });
  }

  for (const article of articles) {
    await prisma.article.create({
      data: {
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl,
        userId: article.userId,
      },
    });
  }

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
