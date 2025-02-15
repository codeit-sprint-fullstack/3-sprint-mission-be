import { PrismaClient } from '@prisma/client';
import { getOrderByClause, INCLUDE_USER_CLAUSE } from '../constants/prisma';
import {
  type CreateArticleRequest,
  type EditArticleRequest,
  type GetArticleListRequest,
} from '../structs/articleStruct';

export default class ArticleRepository {
  constructor(private prismaClient: PrismaClient) {}

  private LIKE_COUNT_CLAUSE = {
    _count: {
      select: {
        likes: true,
      },
    },
  } as const;

  private makeIncludeClause(userId?: number) {
    return {
      ...INCLUDE_USER_CLAUSE,
      ...this.LIKE_COUNT_CLAUSE,
      likes: userId
        ? {
            where: { userId },
            select: { id: true },
            take: 1,
          }
        : {
            select: { id: true },
            take: 0,
          },
    };
  }

  async create(userId: number, data: CreateArticleRequest) {
    return await this.prismaClient.article.create({
      data: {
        ...data,
        userId,
      },
      include: this.makeIncludeClause(userId),
    });
  }

  async update(articleId: number, userId: number, data: EditArticleRequest) {
    return await this.prismaClient.article.update({
      where: {
        id: articleId,
      },
      data,
      include: this.makeIncludeClause(userId),
    });
  }

  async findById(articleId: number, userId: number, tx?: any) {
    const prismaClient = tx || this.prismaClient;
    return await prismaClient.article.findUnique({
      where: {
        id: articleId,
      },
      include: this.makeIncludeClause(userId),
    });
  }

  async getArticleList({ page, pageSize, orderBy, word }: GetArticleListRequest) {
    const skip = (page - 1) * pageSize;

    const whereClause = word
      ? {
          OR: [
            {
              title: {
                contains: word,
              },
            },
            {
              content: {
                contains: word,
              },
            },
          ],
        }
      : undefined;

    const [list, totalCount] = await Promise.all([
      this.prismaClient.article.findMany({
        skip,
        take: pageSize,
        orderBy: getOrderByClause(orderBy),
        where: whereClause,
        include: this.makeIncludeClause(),
      }),
      this.prismaClient.article.count({
        where: whereClause,
      }),
    ]);

    return {
      list,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async delete(articleId: number) {
    await this.prismaClient.article.delete({
      where: {
        id: articleId,
      },
    });
  }
}
