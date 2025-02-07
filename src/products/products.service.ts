import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');
    return product;
  }

  async getProducts(searchKeyword?: string, offset = 0, limit = 10) {
    return this.prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'asc' },
      where: searchKeyword
        ? {
            OR: [
              { name: { contains: searchKeyword, mode: 'insensitive' } },
              { description: { contains: searchKeyword, mode: 'insensitive' } },
            ],
          }
        : {},
      select: { id: true, name: true, price: true, createdAt: true },
    });
  }

  async createProduct(userId: number, createProductDto: CreateProductDto, image?: string) {
    return this.prisma.product.create({
      data: { ...createProductDto, image, userId },
    });
  }

  async updateProduct(userId: number, id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');
    if (product.userId !== userId) throw new ForbiddenException('수정 권한이 없습니다.');

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async deleteProduct(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');
    if (product.userId !== userId) throw new ForbiddenException('삭제 권한이 없습니다.');

    await this.prisma.product.delete({ where: { id } });
    return { message: '상품이 삭제되었습니다.' };
  }

  async likeProduct(userId: number, productId: number) {
    return this.prisma.isLiked.create({ data: { userId, productId } });
  }

  async unlikeProduct(userId: number, productId: number) {
    await this.prisma.isLiked.deleteMany({ where: { userId, productId } });
    return { message: '좋아요가 취소되었습니다.' };
  }

  async getComments(limit: number = 10) {
    return this.prisma.productComment.findMany({ orderBy: { createdAt: 'asc' }, take: limit });
  }
}
