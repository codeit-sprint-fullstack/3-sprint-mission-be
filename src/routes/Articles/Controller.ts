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
} from './Service';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const router = express.Router();

router.get('/', asyncRequestHandler(getArticleList));
router.get('/:articleId', asyncRequestHandler(getArticle));
router.get('/:articleId/comments', asyncRequestHandler(getArticleComments));

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

export default router;
