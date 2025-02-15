import { prismaClient } from '../prismaClient';

export default class LikeRepository {
  async countLike(articleId: number) {
    return await prismaClient.like.count({
      where: {
        articleId,
      },
    });
  }

  async findIsLiked(articleId: number, userId: number) {
    const count = await prismaClient.like.count({
      where: {
        articleId,
        userId,
      },
    });
    return count > 0;
  }

  async setLike(articleId: number, userId: number, tx?: any) {
    const prisma = tx || prismaClient;
    await prisma.like.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  async deleteLike(articleId: number, userId: number, tx?: any) {
    const prisma = tx || prismaClient;
    await prisma.like.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
}
