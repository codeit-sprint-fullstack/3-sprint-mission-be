import { Request, Response } from 'express';
import { assert, create } from 'superstruct';
import {
  CreateProductRequestStruct,
  EditProductStruct,
  GetProductListRequestStruct,
} from '../../structs/ProductStruct';
import { Prisma } from '@prisma/client';
import { prismaClient } from '../../prismaClient';
import { Product } from '../../models/product';
import { EXCEPTION_MESSAGES } from '../../constant/ExceptionMessages';

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
  assert(req.body, EditProductStruct);

  try {
    const product = await prismaClient.product.update({
      where: { id },
      data: req.body,
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
