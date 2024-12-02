import { Request, Response } from 'express';
import { prismaClient } from '../../prismaClient';
import { create } from 'superstruct';
import {
  CreateArticleRequestStruct,
  EditArticleRequestStruct,
  GetArticleListRequestStruct,
} from '../../structs/ArticleStruct';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import { Prisma } from '@prisma/client';
import { Article } from '../../models/article';

export const postArticle = async (req: Request, res: Response) => {
  const data = create(req.body, CreateArticleRequestStruct);

  const newArticle = await prismaClient.article.create({
    data,
  });

  return res.status(201).json(newArticle);
};

export const getArticle = async (req: Request, res: Response) => {
  const { articleId } = req.params;

  try {
    const article = await prismaClient.article.findUniqueOrThrow({
      where: { id: articleId },
    });
    return res.status(200).json(article);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });
    }
    throw e;
  }
};

export const editArticle = async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const data = create(req.body, EditArticleRequestStruct);

  try {
    const article = await prismaClient.article.update({
      where: { id: articleId },
      data,
    });
    return res.status(200).json(article);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });
    }
    throw e;
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    await prismaClient.article.delete({ where: { id: articleId } });
    res.sendStatus(204);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });
    }
    throw e;
  }
};

export const getArticleList = async (req: Request, res: Response) => {
  const { skip, take, orderBy, word } = create(req.query, GetArticleListRequestStruct);

  const whereClause = word
    ? {
        OR: [
          {
            title: {
              contains: word,
            },
          },
          {
            content: {
              contains: word,
            },
          },
        ],
      }
    : undefined;

  const total = await prismaClient.article.count({ where: whereClause });

  const articleEntities = await prismaClient.article.findMany({
    skip,
    take,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' },
    where: whereClause,
  });

  const articles = articleEntities.map((articleEntity) => new Article(articleEntity));

  return res.status(200).json({
    count: total,
    data: articles.slice(0, take).map((article) => ({
      id: article.getId(),
      title: article.getTitle(),
      content: article.getContent(),
      createdAt: article.getCreatedAt(),
      updatedAt: article.getUpdatedAt(),
    })),
  });
};
