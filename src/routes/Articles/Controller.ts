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

router.get('/', asyncRequestHandler(getArticleList));

router.get(
  '/:articleId',
  createAuthMiddleware(AUTH_MESSAGES.read),
  asyncRequestHandler(getArticle),
);
router.get(
  '/:articleId/comments',
  createAuthMiddleware(AUTH_MESSAGES.read),
  asyncRequestHandler(getArticleComments),
);
router.post('/', createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postArticle));
router.patch(
  '/:articleId',
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(editArticle),
);
router.delete(
  '/:articleId',
  createAuthMiddleware(AUTH_MESSAGES.delete),
  asyncRequestHandler(deleteArticle),
);
router.post(
  '/:articleId/comments',
  createAuthMiddleware(AUTH_MESSAGES.create),
  asyncRequestHandler(postArticleComment),
);

router.post(
  '/:articleId/comments',
  createAuthMiddleware(AUTH_MESSAGES.create),
  asyncRequestHandler(postArticleComment),
);

router.post(
  '/:articleId/like',
  createAuthMiddleware(AUTH_MESSAGES.create),
  asyncRequestHandler(setLike),
);

router.delete(
  '/:articleId/like',
  createAuthMiddleware(AUTH_MESSAGES.delete),
  asyncRequestHandler(deleteLike),
);

export default router;
