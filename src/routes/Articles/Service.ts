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
import { CreateCommentStruct, GetCommentListStruct } from '../../structs/CommentStruct';
import { Comment } from '../../models/comment';

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
    const articleEntity = await prismaClient.article.findUniqueOrThrow({
      where: { id: articleId },
    });
    const article = new Article(articleEntity);

    return res.status(200).json({
      id: article.getId(),
      title: article.getTitle(),
      content: article.getContent(),
      createdAt: article.getCreatedAt(),
    });
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
    })),
  });
};

export const postArticleComment = async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const { content } = create(req.body, CreateCommentStruct);

  const commentEntity = await prismaClient.$transaction(async (t) => {
    const targetArticleEntity = await t.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!targetArticleEntity) {
      return null;
    }

    return await t.comment.create({
      data: {
        articleId,
        content,
      },
    });
  });

  if (!commentEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });

  const comment = new Comment(commentEntity);

  return res.status(201).json({
    id: comment.getId(),
    content: comment.getContent(),
    createdAt: comment.getCreatedAt(),
  });
};

export const getArticleComments = async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const { cursor, take } = create(req.query, GetCommentListStruct);

  const commentEntities = await prismaClient.$transaction(async (t) => {
    const targetArticleEntity = await t.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!targetArticleEntity) return null;

    return await t.comment.findMany({
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: take + 1,
      where: {
        articleId,
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    });
  });

  if (!commentEntities)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });

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
