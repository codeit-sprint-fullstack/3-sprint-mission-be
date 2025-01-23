import { prismaClient } from '../prismaClient';

export default class FavoriteRepository {
  async countFavorite(productId: number) {
    return await prismaClient.favorite.count({
      where: {
        productId,
      },
    });
  }

  async findIsFavorite(productId: number, userId: number) {
    const count = await prismaClient.favorite.count({
      where: {
        productId,
        userId,
      },
    });
    return count > 0;
  }

  async setFavorite(productId: number, userId: number) {
    await prismaClient.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async deleteFavorite(productId: number, userId: number) {
    await prismaClient.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}
