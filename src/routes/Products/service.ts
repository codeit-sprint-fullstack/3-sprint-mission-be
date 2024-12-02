import { Request, Response } from 'express';
import { create } from 'superstruct';
import {
  CreateProductRequestStruct,
  EditProductStruct,
  GetProductListRequestStruct,
} from '../../structs/ProductStruct';
import { Prisma } from '@prisma/client';
import { prismaClient } from '../../prismaClient';
import { Product } from '../../models/product';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import { CreateCommentStruct, GetCommentListStruct } from '../../structs/CommentStruct';
import { Comment } from '../../models/comment';

export const postProduct = async (req: Request, res: Response) => {
  const data = create(req.body, CreateProductRequestStruct);

  const newProduct = await prismaClient.product.create({
    data,
  });

  return res.status(201).json(newProduct);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prismaClient.product.findUniqueOrThrow({
      where: { id },
    });
    return res.status(200).json(product);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });
    }
    throw e;
  }
};

export const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = create(req.body, EditProductStruct);

  try {
    const product = await prismaClient.product.update({
      where: { id },
      data,
    });
    return res.status(200).json(product);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });
    }
    throw e;
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prismaClient.product.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    throw e;
  }
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

  const total = await prismaClient.product.count({ where: whereClause });

  const productEntities = await prismaClient.product.findMany({
    skip,
    take,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' },
    where: whereClause,
  });

  const products = productEntities.map((productEntity) => new Product(productEntity));

  return res.status(200).json({
    count: total,
    data: products.slice(0, take).map((product) => ({
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      tags: product.getTags(),
      createdAt: product.getCreatedAt(),
    })),
  });
};

export const postProductComment = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { content } = create(req.body, CreateCommentStruct);

  const commentEntity = await prismaClient.$transaction(async (t) => {
    const targetProductEntity = await t.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!targetProductEntity) {
      return null;
    }

    return await t.comment.create({
      data: {
        productId,
        content,
      },
    });
  });

  if (!commentEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  const comment = new Comment(commentEntity);

  return res.status(201).json({
    id: comment.getId(),
    content: comment.getContent(),
    createdAt: comment.getCreatedAt(),
  });
};

export const getProductComments = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { cursor, take } = create(req.query, GetCommentListStruct);

  const commentEntities = await prismaClient.$transaction(async (t) => {
    const targetProductEntity = await t.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!targetProductEntity) return null;

    return await t.comment.findMany({
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: take + 1,
      where: {
        articleId: productId,
      },
    });
  });

  if (!commentEntities)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  const comments = commentEntities?.map((commentEntity) => new Comment(commentEntity));

  const hasNext = comments.length === take + 1;

  return res.status(200).json({
    data: comments.slice(0, take).map((comment) => ({
      id: comment.getId(),
      articleId: comment.getArticleId(),
      content: comment.getContent(),
      createdAt: comment.getCreatedAt(),
    })),
    hasNext,
    nextCursor: hasNext ? comments[comments.length - 1].getId() : null,
  });
};
