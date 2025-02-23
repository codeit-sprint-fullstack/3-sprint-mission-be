import { PrismaClient } from '@prisma/client';

export default class LikeRepository {
  constructor(private prismaClient: PrismaClient) {}

  async countLike(articleId: number) {
    return await this.prismaClient.like.count({
      where: {
        articleId,
      },
    });
  }

  async findIsLiked(articleId: number, userId: number) {
    const count = await this.prismaClient.like.count({
      where: {
        articleId,
        userId,
      },
    });
    return count > 0;
  }

  async setLike(articleId: number, userId: number, tx?: any) {
    const prisma = tx || this.prismaClient;
    await prisma.like.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  async deleteLike(articleId: number, userId: number, tx?: any) {
    const prisma = tx || this.prismaClient;
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
