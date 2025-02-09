import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(
    sort: string,
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const whereCondition = search
      ? { name: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const total = await this.prisma.product.count({ where: whereCondition });

    const products = await this.prisma.product.findMany({
      where: whereCondition,
      orderBy: sort === 'like' ? { like: 'desc' } : { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { nickname: true } } },
    });

    return { products, total };
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { nickname: true } },
      },
    });
  }

  async createProduct(userId: string, data: any) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        like: 0,
        imageUrl: data.imageUrl,
        userId,
        tags: data.tags,
      },
    });
  }
}
