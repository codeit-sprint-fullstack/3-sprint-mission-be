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
import { INCLUDE_USER_CLAUSE, getOrderByClause, getWhereByWord } from '../../constants/prisma';
import { handlePrismaError } from '../../utils/handlePrismaError';

export const postArticle = async (req: Request, res: Response) => {
  const data = create(req.body, CreateArticleRequestStruct);

  const newArticle = await prismaClient.article.create({
    data: {
      ...data,
      userId: req.user!.userId,
    },
    include: INCLUDE_USER_CLAUSE,
  });

  return res.status(201).json(newArticle);
};

export const getArticle = async (req: Request, res: Response) => {
  const { articleId } = req.params;

  try {
    const articleEntity = await prismaClient.article.findUniqueOrThrow({
      where: { id: parseInt(articleId) },
      include: INCLUDE_USER_CLAUSE,
    });
    const article = new Article(articleEntity);

    return res.status(200).json(article.toJSON());
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
      where: { id: parseInt(articleId) },
      data,
    });
    return res.status(200).json(article);
  } catch (e) {
    handlePrismaError(e, res);
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    await prismaClient.article.delete({ where: { id: parseInt(articleId) } });
    res.sendStatus(204);
  } catch (e) {
    handlePrismaError(e, res);
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
    orderBy: getOrderByClause(orderBy || 'recent'),
    where: getWhereByWord(word),
    include: INCLUDE_USER_CLAUSE,
  });

  const articles = articleEntities.map((articleEntity) => new Article(articleEntity));

  return res.status(200).json({
    count: total,
    data: articles.slice(0, take).map((article) => article.toJSON()),
  });
};

export const postArticleComment = async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const { content } = create(req.body, CreateCommentStruct);
  const { userId } = req.user!;

  const commentEntity = await prismaClient.$transaction(async (t) => {
    const targetArticleEntity = await t.article.findUnique({
      where: {
        id: parseInt(articleId),
      },
    });

    if (!targetArticleEntity) {
      return null;
    }

    return await t.comment.create({
      data: {
        articleId: parseInt(articleId),
        content,
        userId,
      },
      include: INCLUDE_USER_CLAUSE,
    });
  });

  if (!commentEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });

  const comment = new Comment(commentEntity);

  return res.status(201).json(comment.toJSON());
};

export const getArticleComments = async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const { cursor, take } = create(req.query, GetCommentListStruct);

  const commentEntities = await prismaClient.$transaction(async (t) => {
    const targetArticleEntity = await t.article.findUnique({
      where: {
        id: parseInt(articleId),
      },
    });

    if (!targetArticleEntity) return null;

    return await t.comment.findMany({
      cursor: cursor
        ? {
            id: parseInt(cursor),
          }
        : undefined,
      take: take + 1,
      where: {
        articleId: parseInt(articleId),
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
      include: INCLUDE_USER_CLAUSE,
    });
  });

  if (!commentEntities)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });

  const comments = commentEntities?.map((commentEntity) => new Comment(commentEntity));

  const hasNext = comments.length === take + 1;

  return res.status(200).json({
    data: comments.map((comment) => comment.toJSON()),
    hasNext,
    nextCursor: hasNext ? comments[comments.length - 1].getId() : null,
  });
};
