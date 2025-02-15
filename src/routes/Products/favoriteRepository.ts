import { PrismaClient } from '@prisma/client';

export default class FavoriteRepository {
  constructor(private prismaClient: PrismaClient) {}

  async countFavorite(productId: number) {
    return await this.prismaClient.favorite.count({
      where: {
        productId,
      },
    });
  }

  async findIsFavorite(productId: number, userId: number) {
    const count = await this.prismaClient.favorite.count({
      where: {
        productId,
        userId,
      },
    });
    return count > 0;
  }

  async setFavorite(productId: number, userId: number, tx: any) {
    await this.prismaClient.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async deleteFavorite(productId: number, userId: number, tx: any) {
    await this.prismaClient.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}
