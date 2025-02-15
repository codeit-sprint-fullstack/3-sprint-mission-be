import express from 'express';
import { ArticleService } from './service';
import ArticleRepository from '@/routes/Articles/articleRepository';
import LikeRepository from '@/routes/Articles/likeRepository';
import CommentRepository from '@/routes/Comments/commentRepository';
import { prismaClient } from '@/prismaClient';
import { ArticleController } from './controller';
import asyncRequestHandler from '@/core/handlers/asyncRequestHandler';
import { createAuthMiddleware } from '@/core/middleware/auth/auth';
import { AUTH_MESSAGES } from '@/constants/authMessages';
import { validateBody, validateQuery } from '@/core/middleware/validate';
import {
  CreateArticleRequestStruct,
  EditArticleRequestStruct,
  GetArticleListRequestStruct,
} from '@/structs/articleStruct';
import { CreateCommentStruct, GetCommentListStruct } from '@/structs/commentStruct';

const router = express.Router();

const articleService = new ArticleService(
  new ArticleRepository(prismaClient),
  new LikeRepository(prismaClient),
  new CommentRepository(prismaClient),
  prismaClient,
);

const articleController = new ArticleController(articleService);

const {
  getArticles,
  postArticle,
  getArticle,
  editArticle,
  deleteArticle,
  postArticleComment,
  getArticleComments,
  setLike,
  deleteLike,
} = articleController;

router
  .route('/')
  .get(validateQuery(GetArticleListRequestStruct), asyncRequestHandler(getArticles))
  .post(
    validateBody(CreateArticleRequestStruct),
    createAuthMiddleware(AUTH_MESSAGES.create),
    asyncRequestHandler(postArticle),
  );

router
  .route('/:articleId')
  .get(createAuthMiddleware(AUTH_MESSAGES.read), asyncRequestHandler(getArticle))
  .patch(
    validateBody(EditArticleRequestStruct),
    createAuthMiddleware(AUTH_MESSAGES.update),
    asyncRequestHandler(editArticle),
  )
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteArticle));

router
  .route('/:articleId/comments')
  .get(
    validateQuery(GetCommentListStruct),
    createAuthMiddleware(AUTH_MESSAGES.read),
    asyncRequestHandler(getArticleComments),
  )
  .post(
    validateBody(CreateCommentStruct),
    createAuthMiddleware(AUTH_MESSAGES.create),
    asyncRequestHandler(postArticleComment),
  );

router
  .route('/:articleId/like')
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(setLike))
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteLike));

export default router;
