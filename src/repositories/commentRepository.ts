import { INCLUDE_USER_CLAUSE } from '../constants/prisma';
import { prismaClient } from '../prismaClient';

export default class CommentRepository {
  async findComments(params: {
    articleId?: number;
    productId?: number;
    cursor?: string;
    take: number;
  }) {
    if ((params.articleId && params.productId) || (!params.articleId && !params.productId)) {
      throw new Error('articleId와 productId 중 하나를 입력해주세요.');
    }

    return await prismaClient.comment.findMany({
      cursor: params.cursor
        ? {
            id: parseInt(params.cursor),
          }
        : undefined,
      take: params.take,
      where: {
        ...(params.articleId && { articleId: params.articleId }),
        ...(params.productId && { productId: params.productId }),
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async createArticleComment(params: { articleId: number; content: string; userId: number }) {
    return await prismaClient.comment.create({
      data: {
        articleId: params.articleId,
        content: params.content,
        userId: params.userId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async createProductComment(params: { productId: number; content: string; userId: number }) {
    return await prismaClient.comment.create({
      data: {
        productId: params.productId,
        content: params.content,
        userId: params.userId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }
}
