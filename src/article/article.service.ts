import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(
    userId: string,
    title: string,
    content: string,
    imageUrl: string,
  ) {
    return await this.prisma.article.create({
      data: {
        userId,
        title,
        content,
        imageUrl,
      },
    });
  }

  async getAllArticles(sort: string, search?: string, pageSize: number = 6) {
    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};

    const total = await this.prisma.article.count({ where: whereCondition });

    const articles = await this.prisma.article.findMany({
      where: whereCondition,
      orderBy: sort === 'like' ? { like: 'desc' } : { createdAt: 'desc' },
      include: {
        user: { select: { nickname: true } },
      },
      take: pageSize,
    });

    return { articles, total };
  }

  async getBestArticles() {
    return this.prisma.article.findMany({
      take: 3,
      orderBy: { like: 'desc' },
      include: {
        user: { select: { nickname: true } },
      },
    });
  }
}
