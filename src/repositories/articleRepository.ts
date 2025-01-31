import { getOrderByClause, INCLUDE_USER_CLAUSE } from '../constants/prisma';
import { prismaClient } from '../prismaClient';
import {
  type CreateArticleRequest,
  type EditArticleRequest,
  type GetArticleListRequest,
} from '../structs/ArticleStruct';

export default class ArticleRepository {
  async create(userId: number, data: CreateArticleRequest) {
    return await prismaClient.article.create({
      data: {
        ...data,
        userId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async update(articleId: number, data: EditArticleRequest) {
    return await prismaClient.article.update({
      where: {
        id: articleId,
      },
      data,
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async findById(articleId: number) {
    return await prismaClient.article.findUnique({
      where: {
        id: articleId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async getArticleList({ page, pageSize, orderBy, keyword }: GetArticleListRequest) {
    const skip = (page - 1) * pageSize;

    const whereClause = keyword
      ? {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              content: {
                contains: keyword,
              },
            },
          ],
        }
      : undefined;

    const [list, totalCount] = await Promise.all([
      prismaClient.article.findMany({
        skip,
        take: pageSize,
        orderBy: getOrderByClause(orderBy),
        where: whereClause,
        include: INCLUDE_USER_CLAUSE,
      }),
      prismaClient.article.count({
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
    await prismaClient.article.delete({
      where: {
        id: articleId,
      },
    });
  }

  async incrementLikeCount(articleId: number) {
    return await prismaClient.article.update({
      where: {
        id: articleId,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async decrementLikeCount(articleId: number) {
    return await prismaClient.article.update({
      where: {
        id: articleId,
      },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }
}
