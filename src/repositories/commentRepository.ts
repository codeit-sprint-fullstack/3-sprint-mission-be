import { INCLUDE_USER_CLAUSE } from '../constants/prisma';
import { prismaClient } from '../prismaClient';
import { CreateCommentRequest } from '../structs/CommentStruct';

export default class CommentRepository {
  async findComments(params: {
    articleId?: number;
    productId?: number;
    cursor?: number;
    take: number;
  }) {
    if ((params.articleId && params.productId) || (!params.articleId && !params.productId)) {
      throw new Error('articleId와 productId 중 하나를 입력해주세요.');
    }

    return await prismaClient.comment.findMany({
      cursor: params.cursor
        ? {
            id: params.cursor,
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

  async createArticleComment(articleId: number, userId: number, params: CreateCommentRequest) {
    return await prismaClient.comment.create({
      data: {
        articleId: articleId,
        content: params.content,
        userId: userId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }

  async createProductComment(productId: number, userId: number, params: CreateCommentRequest) {
    return await prismaClient.comment.create({
      data: {
        productId: productId,
        content: params.content,
        userId: userId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  }
}
