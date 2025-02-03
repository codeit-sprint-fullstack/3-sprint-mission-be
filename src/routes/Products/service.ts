import { PrismaClient } from '@prisma/client';
import CommentRepository from '../../repositories/commentRepository';
import FavoriteRepository from '../../repositories/favoriteRepository';
import ProductRepository from '../../repositories/productRepository';
import {
  CreateProductRequest,
  EditProductRequest,
  GetProductListRequest,
} from '../../structs/ProductStruct';
import { Product } from '../../models/product';
import { ConflictException, ForbiddenException, NotFoundException } from '../../errors';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { CreateCommentRequest, GetCommentListRequest } from '../../structs/CommentStruct';
import { Comment } from '../../models/comment';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private favoriteRepository: FavoriteRepository,
    private commentRepository: CommentRepository,
    private prisma: PrismaClient,
  ) {}

  private async getExistingProduct(productId: number) {
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) throw new NotFoundException(EXCEPTION_MESSAGES.productNotFound);
    return existingProduct;
  }

  private async validateAuth(productUserId: number, userId: number, message: string) {
    if (productUserId !== userId) throw new ForbiddenException(message);
  }

  async postProduct(userId: number, createProductDto: CreateProductRequest) {
    const productEntity = await this.productRepository.create(userId, createProductDto);
    return new Product({ ...productEntity, isFavorite: false });
  }

  async getProductById(productId: number, userId: number) {
    const productEntity = await this.getExistingProduct(productId);
    const isFavorite = await this.favoriteRepository.findIsFavorite(productId, userId);

    return new Product({ ...productEntity, isFavorite });
  }

  async editProduct(productId: number, userId: number, editProductRequestDto: EditProductRequest) {
    const existingProduct = await this.getExistingProduct(productId);
    await this.validateAuth(existingProduct.userId, userId, AUTH_MESSAGES.update);

    const productEntity = await this.productRepository.update(productId, editProductRequestDto);
    const isFavorite = await this.favoriteRepository.findIsFavorite(productId, userId);

    return new Product({ ...productEntity, isFavorite });
  }

  async deleteProduct(productId: number, userId: number) {
    const existingProduct = await this.getExistingProduct(productId);
    await this.validateAuth(existingProduct.userId, userId, AUTH_MESSAGES.delete);

    await this.productRepository.delete(productId);
  }

  async getProductList(userId: number, getProductListDto: GetProductListRequest) {
    const productListResult = await this.productRepository.getProductList(getProductListDto);

    const products = await Promise.all(
      productListResult.list.map(async (productEntity) => {
        if (!userId) return new Product({ ...productEntity, isFavorite: false });
        const isFavorite = await this.favoriteRepository.findIsFavorite(productEntity.id, userId);
        return new Product({ ...productEntity, isFavorite });
      }),
    );

    return {
      ...productListResult,
      list: products,
    };
  }

  async postProductComment(productId: number, userId: number, content: CreateCommentRequest) {
    await this.getExistingProduct(productId);
    const commentEntity = await this.commentRepository.createProductComment(
      productId,
      userId,
      content,
    );

    return new Comment(commentEntity);
  }

  async getProductComments(productId: number, getCommentListDto: GetCommentListRequest) {
    await this.getExistingProduct(productId);

    const getCommentListResult = await this.commentRepository.findComments({
      ...getCommentListDto,
      productId,
    });
    const comments = getCommentListResult.comments.map((comment) => new Comment(comment));

    return {
      ...getCommentListResult,
      comments,
    };
  }

  async setFavorite(productId: number, userId: number) {
    await this.getExistingProduct(productId);

    if (await this.favoriteRepository.findIsFavorite(productId, userId))
      throw new ConflictException('이미 좋아요가 눌린 상품입니다.');

    const productEntity = await this.prisma.$transaction(async (t) => {
      await this.favoriteRepository.setFavorite(productId, userId);
      const product = await this.productRepository.incrementFavoriteCount(productId);
      return product;
    });

    return new Product({ ...productEntity, isFavorite: true });
  }

  async deleteFavorite(productId: number, userId: number) {
    await this.getExistingProduct(productId);

    if (await this.favoriteRepository.findIsFavorite(productId, userId))
      throw new ConflictException('이미 좋아요가 취소된 상품입니다.');

    const productEntity = await this.prisma.$transaction(async (t) => {
      await this.favoriteRepository.deleteFavorite(productId, userId);
      const product = await this.productRepository.decrementFavoriteCount(productId);
      return product;
    });

    return new Product({ ...productEntity, isFavorite: false });
  }
}
