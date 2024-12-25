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
import { getOrderByClause, INCLUDE_USER_CLAUSE } from '../../constants/prisma';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { parseId } from '../../utils/parseId';

export const postProduct = async (req: Request, res: Response) => {
  const data = create(req.body, CreateProductRequestStruct);
  const userId = req.user?.userId;

  if (!userId) return res.status(403).json({ message: AUTH_MESSAGES.create });

  const productEntity = await prismaClient.product.create({
    data: {
      ...data,
      userId,
    },
    include: INCLUDE_USER_CLAUSE,
  });
  const product = new Product(productEntity);

  return res.status(201).json(product.toJSON());
};

export const getProduct = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const productEntity = await prismaClient.product.findUniqueOrThrow({
    where: { id: productId! },
    include: INCLUDE_USER_CLAUSE,
  });
  const product = new Product(productEntity);

  return res.status(200).json(product.toJSON());
};

export const editProduct = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const data = create(req.body, EditProductStruct);
  const userId = req.user?.userId;

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (existingProduct.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.update });

  const productEntity = await prismaClient.product.update({
    where: { id: productId },
    data,
    include: INCLUDE_USER_CLAUSE,
  });
  const product = new Product(productEntity);

  return res.status(200).json(product.toJSON());
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  const userId = req.user?.userId;

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (existingProduct.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.delete });

  await prismaClient.product.delete({ where: { id: productId } });
  res.sendStatus(204);
};

export const getProductList = async (req: Request, res: Response) => {
  const { skip, take, orderBy, word } = create(req.query, GetProductListRequestStruct);

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

  const result = await prismaClient.$transaction(async (t) => {
    const total = await t.product.count({ where: whereClause });

    const productEntities = await prismaClient.product.findMany({
      skip,
      take,
      orderBy: getOrderByClause(orderBy || 'recent'),
      where: whereClause,
      include: INCLUDE_USER_CLAUSE,
    });

    return {
      total,
      productEntities,
    };
  });

  const products = result.productEntities.map((productEntity) => new Product(productEntity));

  return res.status(200).json({
    count: result.total,
    data: products.map((product) => product.toJSON()),
  });
};

export const postProductComment = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const { content } = create(req.body, CreateCommentStruct);
  const userId = req.user?.userId;

  const existingProduct = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (!userId || existingProduct.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.create });

  const commentEntity = await prismaClient.comment.create({
    data: {
      productId,
      content,
      userId,
    },
    include: INCLUDE_USER_CLAUSE,
  });
  const comment = new Comment(commentEntity);

  return res.status(201).json(comment.toJSON());
};

export const getProductComments = async (req: Request, res: Response) => {
  const productId = parseId(req.params.productId);
  const { cursor, take } = create(req.query, GetCommentListStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  const commentEntities = await prismaClient.comment.findMany({
    cursor: cursor
      ? {
          id: parseInt(cursor),
        }
      : undefined,
    take: take + 1,
    where: {
      productId,
    },
    include: INCLUDE_USER_CLAUSE,
  });
  const comments = commentEntities?.map((commentEntity) => new Comment(commentEntity));
  const hasNext = comments.length === take + 1;

  return res.status(200).json({
    data: comments.slice(0, take).map((comment) => comment.toJSON()),
    hasNext,
    nextCursor: comments[comments.length - 1].getId(),
  });
};
