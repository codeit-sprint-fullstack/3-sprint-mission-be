import { Request, Response } from 'express';
import { assert, create } from 'superstruct';
import {
  CreateProductStruct,
  EditProductStruct,
  GetProductListRequestStruct,
  validateId,
} from '../../structs/ProductStruct';
import { Prisma } from '@prisma/client';
import { prismaClient } from '../../prismaClient';
import { Product } from '../../models/product';

export const postProduct = async (req: Request, res: Response) => {
  assert(req.body, CreateProductStruct);

  const newProduct = await prismaClient.product.create({
    data: req.body,
  });

  return res.status(201).json(newProduct);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  assert(id, validateId);
  try {
    const product = await prismaClient.product.findUniqueOrThrow({
      where: { id },
    });
    return res.status(200).json(product);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: '상품이 존재하지 않습니다.' });
    }
    throw e;
  }
};

export const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  assert(id, validateId);
  assert(req.body, EditProductStruct);

  const product = await prismaClient.product.update({
    where: { id },
    data: req.body,
  });
  return res.status(200).json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  assert(id, validateId);
  await prismaClient.product.delete({ where: { id } });
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
