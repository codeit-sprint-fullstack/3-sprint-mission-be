import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import {
  deleteProduct,
  editProduct,
  getProduct,
  getProductComments,
  getProductList,
  postProduct,
  postProductComment,
} from './service';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const router = express.Router();

router.get('/', asyncRequestHandler(getProductList));
router.get('/:productId/comments', asyncRequestHandler(getProductComments));
router.get('/:productId', asyncRequestHandler(getProduct));

router.post('/', createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postProduct));
router.patch(
  '/:productId',
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(editProduct),
);
router.delete(
  '/:productId',
  createAuthMiddleware(AUTH_MESSAGES.delete),
  asyncRequestHandler(deleteProduct),
);
router.post(
  '/:productId/comments',
  createAuthMiddleware(AUTH_MESSAGES.create),
  asyncRequestHandler(postProductComment),
);

export default router;
