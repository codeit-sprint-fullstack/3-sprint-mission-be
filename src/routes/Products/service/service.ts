import { PrismaClient } from '@prisma/client';
import CommentRepository from '@/routes/Comments/commentRepository';
import FavoriteRepository from '@/routes/Products/repository/favoriteRepository';
import ProductRepository from '@/routes/Products/repository/productRepository';
import {
  CreateProductRequest,
  EditProductRequest,
  GetProductListRequest,
} from '@/structs/productStruct';
import { Product } from '@/models/product';
import { ConflictException, ForbiddenException, NotFoundException } from '@/core/errors';
import { EXCEPTION_MESSAGES } from '@/constants/exceptionMessages';
import { AUTH_MESSAGES } from '@/constants/authMessages';
import { CreateCommentRequest, GetCommentListRequest } from '@/structs/commentStruct';
import { Comment } from '@/models/comment';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private favoriteRepository: FavoriteRepository,
    private commentRepository: CommentRepository,
    private prisma: PrismaClient,
  ) {}

  private async getExistingProduct(productId: number, userId: number) {
    const existingProduct = await this.productRepository.findById(productId, userId);
    if (!existingProduct) throw new NotFoundException(EXCEPTION_MESSAGES.productNotFound);
    return existingProduct;
  }

  private async validateAuth(productUserId: number, userId: number, message: string) {
    if (productUserId !== userId) throw new ForbiddenException(message);
  }

  async postProduct(userId: number, createProductDto: CreateProductRequest) {
    const { _count, favorites, ...productEntity } = await this.productRepository.create(
      userId,
      createProductDto,
    );
    return new Product({
      ...productEntity,
      favoriteCount: _count.favorites,
      isFavorite: favorites.length > 0,
    });
  }

  async getProductById(productId: number, userId: number) {
    const productEntity = await this.productRepository.findById(productId, userId);
    if (!productEntity) throw new NotFoundException(EXCEPTION_MESSAGES.productNotFound);
    const { _count, favorites, ...productData } = productEntity;

    return new Product({
      ...productData,
      favoriteCount: _count.favorites,
      isFavorite: favorites.length > 0,
    });
  }

  async editProduct(productId: number, userId: number, editProductRequestDto: EditProductRequest) {
    const existingProduct = await this.getExistingProduct(productId, userId);
    await this.validateAuth(existingProduct.userId, userId, AUTH_MESSAGES.update);

    const { _count, favorites, ...productData } = await this.productRepository.update(
      productId,
      userId,
      editProductRequestDto,
    );

    return new Product({
      ...productData,
      favoriteCount: _count.favorites,
      isFavorite: favorites.length > 0,
    });
  }

  async deleteProduct(productId: number, userId: number) {
    const existingProduct = await this.getExistingProduct(productId, userId);
    await this.validateAuth(existingProduct.userId, userId, AUTH_MESSAGES.delete);

    await this.productRepository.delete(productId);
  }

  async getProductList(getProductListDto: GetProductListRequest) {
    const productListResult = await this.productRepository.getProductList(getProductListDto);
    const products = productListResult.list.map(
      ({ _count, favorites, ...productData }) =>
        new Product({
          ...productData,
          favoriteCount: _count.favorites,
          isFavorite: false,
        }),
    );

    return {
      ...productListResult,
      list: products,
    };
  }

  async postProductComment(productId: number, userId: number, content: CreateCommentRequest) {
    await this.getExistingProduct(productId, userId);
    const commentEntity = await this.commentRepository.createProductComment(
      productId,
      userId,
      content,
    );

    return new Comment(commentEntity);
  }

  async getProductComments(
    productId: number,
    userId: number,
    getCommentListDto: GetCommentListRequest,
  ) {
    const product = await this.getExistingProduct(productId, userId);
    if (!product) throw new NotFoundException(EXCEPTION_MESSAGES.productNotFound);

    const getCommentListResult = await this.commentRepository.findComments({
      ...getCommentListDto,
      productId,
    });
    const comments = Comment.fromList(getCommentListResult.comments);

    return {
      ...getCommentListResult,
      comments,
    };
  }

  async setFavorite(productId: number, userId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const product = await this.productRepository.findById(productId, userId, tx);
      if (!product) throw new NotFoundException(EXCEPTION_MESSAGES.productNotFound);
      if (product.favorites.length > 0)
        throw new ConflictException('이미 좋아요가 눌린 상품입니다.');

      await this.favoriteRepository.setFavorite(productId, userId, tx);

      return new Product({
        ...product,
        favoriteCount: product._count.favorite + 1,
        isFavorite: true,
      });
    });
  }

  async deleteFavorite(productId: number, userId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const product = await this.productRepository.findById(productId, userId, tx);
      if (!product) throw new NotFoundException(EXCEPTION_MESSAGES.productNotFound);
      if (product.favorite.length === 0)
        throw new ConflictException('이미 좋아요가 취소된 상품입니다.');

      await this.favoriteRepository.deleteFavorite(productId, userId, tx);
      return new Product({
        ...product,
        favoriteCount: product._count.favorite - 1,
        isFavorite: false,
      });
    });
  }
}
