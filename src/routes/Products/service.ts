import { Request, Response } from 'express';
import { create } from 'superstruct';
import {
  CreateProductRequestStruct,
  EditProductStruct,
  GetProductListRequestStruct,
} from '../../structs/ProductStruct';
import { prismaClient } from '../../prismaClient';
import { Product } from '../../models/product';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import { CreateCommentStruct, GetCommentListStruct } from '../../structs/CommentStruct';
import { Comment } from '../../models/comment';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { parseId } from '../../utils/parseId';
import ProductRepository from '../../repositories/productRepository';
import FavoriteRepository from '../../repositories/favoriteRepository';
import CommentRepository from '../../repositories/commentRepository';

const productRepository = new ProductRepository();
const favoriteRepository = new FavoriteRepository();
const commentRepository = new CommentRepository();

export const postProduct = async (req: Request, res: Response) => {
  const data = create(req.body, CreateProductRequestStruct);
  const userId = req.user?.userId;

  if (!userId) return res.status(403).json({ message: AUTH_MESSAGES.create });

  const productEntity = await productRepository.create(userId, data);
  const product = new Product({ ...productEntity, isFavorite: false });

  return res.status(201).json(product.toJSON());
};

export const getProduct = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const userId = req.user?.userId!;

  const productEntity = await productRepository.findById(productId);
  if (!productEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  const [commentEntities, isFavorite] = await Promise.all([
    commentRepository.findComments({
      productId,
      take: 100,
    }),
    favoriteRepository.findIsFavorite(productId, userId),
  ]);

  const comments = commentEntities?.map((commentEntity) => new Comment(commentEntity));
  const product = new Product({ ...productEntity, isFavorite });

  return res
    .status(200)
    .json({ ...product.toJSON(), comments: comments.map((comment) => comment.toJSON()) });
};

export const editProduct = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const data = create(req.body, EditProductStruct);
  const userId = req.user?.userId!;

  const existingProduct = await productRepository.findById(productId);
  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (existingProduct.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.update });

  const productEntity = await productRepository.update(productId, data);
  const isFavorite = await favoriteRepository.findIsFavorite(productId, userId);
  const product = new Product({ ...productEntity, isFavorite });

  return res.status(200).json(product.toJSON());
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const userId = req.user?.userId!;

  const existingProduct = await productRepository.findById(productId);

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (existingProduct.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.delete });

  await productRepository.delete(productId);
  res.sendStatus(204);
};

export const getProductList = async (req: Request, res: Response) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListRequestStruct);
  const userId = req.user?.userId!;
  const result = await productRepository.getProductList({ page, pageSize, orderBy, keyword });
  const products = await Promise.all(
    result.list.map(async (product) => {
      if (!userId) return new Product({ ...product, isFavorite: false });
      const isFavorite = await favoriteRepository.findIsFavorite(product.id, userId);
      return new Product({ ...product, isFavorite }).toJSON();
    }),
  );

  return res.status(201).json({
    ...result,
    list: products,
  });
};

export const postProductComment = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const { content } = create(req.body, CreateCommentStruct);
  const userId = req.user?.userId;
  const existingProduct = await productRepository.findById(productId);

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (!userId || existingProduct.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.create });

  const commentEntity = await commentRepository.createProductComment({
    productId,
    content,
    userId,
  });
  const comment = new Comment(commentEntity);

  return res.status(201).json(comment.toJSON());
};

export const getProductComments = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const { cursor, take } = create(req.query, GetCommentListStruct);
  const existingProduct = await productRepository.findById(productId);

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  const commentEntities = await commentRepository.findComments({
    cursor,
    productId,
    take: take ?? 10,
  });

  if (!commentEntities || commentEntities.length === 0) {
    return res.status(200).json({
      list: [],
      hasNext: false,
      nextCursor: null,
    });
  }

  const comments = commentEntities?.map((commentEntity) => new Comment(commentEntity));
  const hasNext = comments.length === take && take + 1;

  return res.status(200).json({
    list: comments.map((comment) => comment.toJSON()),
    hasNext,
    nextCursor: comments[comments.length - 1].getId(),
  });
};

export const setFavorite = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const userId = req.user?.userId!;

  const existingProduct = productRepository.findById(productId);

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (await favoriteRepository.findIsFavorite(productId, userId))
    res.status(409).json({ message: '이미 좋아요를 누른 상품입니다.' });

  const productEntity = await prismaClient.$transaction(async (t) => {
    await favoriteRepository.setFavorite(productId, userId);
    const product = await productRepository.incrementFavoriteCount(productId);
    return product;
  });

  const product = new Product({ ...productEntity, isFavorite: true });

  return res.status(200).json(product);
};

export const deleteFavorite = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const userId = req.user?.userId!;

  const existingProduct = await productRepository.findById(productId);

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  const isFavorite = await favoriteRepository.findIsFavorite(productId, userId);

  if (!isFavorite) return res.status(409).json({ message: '이미 좋아요가 취소된 상품입니다.' });

  const productEntity = await prismaClient.$transaction(async (t) => {
    await favoriteRepository.deleteFavorite(productId, userId);
    const product = await productRepository.decrementFavoriteCount(productId);
    return product;
  });

  const product = new Product({ ...productEntity, isFavorite: false });

  return res.status(200).json(product);
};
