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
import { parseId } from '../../utils/parseId';
import ArticleRepository from '../../repositories/articleRepository';
import LikeRepository from '../../repositories/likeRepository';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import CommentRepository from '../../repositories/commentRepository';

const articleRepository = new ArticleRepository();
const likeRepository = new LikeRepository();
const commentRepository = new CommentRepository();

export const postArticle = async (req: Request, res: Response) => {
  const data = create(req.body, CreateArticleRequestStruct);
  const userId = req.user?.userId!;

  const newArticle = await articleRepository.create(userId, data);

  return res.status(201).json(newArticle);
};

export const getArticle = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  const userId = req.user?.userId!;
  const articleEntity = await articleRepository.findById(articleId);

  if (!articleEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });
  const isLiked = await likeRepository.findIsLiked(articleId, userId);

  const article = new Article({ ...articleEntity, isLiked });

  return res.status(200).json(article.toJSON());
};

export const editArticle = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  const data = create(req.body, EditArticleRequestStruct);

  const article = await articleRepository.update(articleId, data);
  return res.status(200).json(article);
};

export const deleteArticle = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  await articleRepository.delete(articleId);
  res.sendStatus(204);
};

export const getArticleList = async (req: Request, res: Response) => {
  const userId = req.user?.userId!;

  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListRequestStruct);

  const articleEntities = await articleRepository.getArticleList({
    page,
    pageSize,
    orderBy,
    keyword,
  });

  const articles = await Promise.all(
    articleEntities.list.map(async (articleEntity) => {
      if (!userId) return new Article({ ...articleEntity, isLiked: false });
      const isLiked = await likeRepository.findIsLiked(articleEntity.id, userId);
      return new Article({ ...articleEntity, isLiked });
    }),
  );

  return res.status(200).json({
    count: articleEntities.totalCount,
    list: articles,
  });
};

export const postArticleComment = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  const { content } = create(req.body, CreateCommentStruct);
  const { userId } = req.user!;

  const existingArticle = await articleRepository.findById(articleId);

  if (!existingArticle)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });

  if (!userId || existingArticle.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.create });

  const commentEntity = await commentRepository.createArticleComment({
    articleId,
    content,
    userId,
  });
  const comment = new Comment(commentEntity);

  return res.status(201).json(comment.toJSON());
};

export const getArticleComments = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  const { cursor, take } = create(req.query, GetCommentListStruct);

  const existingArticle = articleRepository.findById(articleId);
  if (!existingArticle)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.articleNotFound });

  const commentEntities = await commentRepository.findComments({
    articleId,
    cursor,
    take,
  });

  const comments = commentEntities.map((commentEntity) => new Comment(commentEntity));
  const hasNext = comments.length === take + 1;

  return res.status(200).json({
    data: comments.map((comment) => comment.toJSON()),
    hasNext,
    nextCursor: comments[comments.length - 1].getId(),
  });
};

export const setLike = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  const userId = req.user?.userId!;

  const existingArticle = articleRepository.findById(articleId);

  if (!existingArticle)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (await likeRepository.findIsLiked(articleId, userId))
    res.status(409).json({ message: '이미 좋아요가 눌린 게시글입니다.' });

  const articleEntity = await prismaClient.$transaction(async (t) => {
    await likeRepository.setLike(articleId, userId);
    const product = await articleRepository.incrementLikeCount(articleId);
    return product;
  });

  const article = new Article({ ...articleEntity, isLiked: true });

  return res.status(200).json(article);
};

export const deleteLike = async (req: Request, res: Response) => {
  const articleId = parseId(req.params.articleId);
  const userId = req.user?.userId!;

  const existingArticle = articleRepository.findById(articleId);

  if (!existingArticle)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.productNotFound });

  if (!(await likeRepository.findIsLiked(articleId, userId)))
    res.status(409).json({ message: '이미 좋아요가 취소된 게시글입니다.' });

  const articleEntity = await prismaClient.$transaction(async (t) => {
    await likeRepository.deleteLike(articleId, userId);
    const product = await articleRepository.decrementLikeCount(articleId);
    return product;
  });

  const article = new Article({ ...articleEntity, isLiked: false });

  return res.status(200).json(article);
};
