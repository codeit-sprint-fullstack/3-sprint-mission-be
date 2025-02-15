import { PrismaClient } from '@prisma/client';
import { getOrderByClause, INCLUDE_USER_CLAUSE } from '../../constants/prisma';
import {
  CreateProductRequest,
  EditProductRequest,
  GetProductListRequest,
} from '../../structs/productStruct';

export default class ProductRepository {
  constructor(private prismaClient: PrismaClient) {}

  private FAVORITE_COUNT_CLAUSE = {
    _count: {
      select: {
        favorites: true,
      },
    },
  } as const;

  private makeIncludeClause(userId?: number) {
    return {
      ...INCLUDE_USER_CLAUSE,
      ...this.FAVORITE_COUNT_CLAUSE,
      favorites: userId
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

  async create(userId: number, data: CreateProductRequest) {
    return await this.prismaClient.product.create({
      data: {
        ...data,
        userId,
      },
      include: this.makeIncludeClause(userId),
    });
  }

  async update(productId: number, userId: number, data: EditProductRequest) {
    return await this.prismaClient.product.update({
      where: {
        id: productId,
      },
      data,
      include: this.makeIncludeClause(userId),
    });
  }

  async findById(productId: number, userId: number, tx?: any) {
    const prisma = tx || this.prismaClient;
    return await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        ...this.makeIncludeClause(userId),
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async getProductList({ page, pageSize, orderBy, word }: GetProductListRequest) {
    const skip = (page - 1) * pageSize;
    const whereClause = word
      ? {
          OR: [
            {
              name: {
                contains: word,
              },
            },
            {
              description: {
                contains: word,
              },
            },
          ],
        }
      : undefined;
    const [list, totalCount] = await Promise.all([
      this.prismaClient.product.findMany({
        skip,
        take: pageSize,
        orderBy: getOrderByClause(orderBy),
        where: whereClause,
        include: this.makeIncludeClause(),
      }),
      this.prismaClient.product.count({
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

  async delete(productId: number) {
    await this.prismaClient.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
