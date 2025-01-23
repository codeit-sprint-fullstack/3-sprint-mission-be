import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import {
  editArticle,
  postArticle,
  getArticle,
  getArticleList,
  deleteArticle,
  getArticleComments,
  postArticleComment,
  setLike,
  deleteLike,
} from './Service';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const router = express.Router();

router
  .route('/')
  .get(asyncRequestHandler(getArticleList))
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postArticle));

router
  .route('/:articleId')
  .get(createAuthMiddleware(AUTH_MESSAGES.read), asyncRequestHandler(getArticle))
  .patch(createAuthMiddleware(AUTH_MESSAGES.update), asyncRequestHandler(editArticle))
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteArticle));

router
  .route('/:articleId/comments')
  .get(createAuthMiddleware(AUTH_MESSAGES.read), asyncRequestHandler(getArticleComments))
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postArticleComment));

router
  .route('/:articleId/like')
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(setLike))
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteLike));

export default router;
