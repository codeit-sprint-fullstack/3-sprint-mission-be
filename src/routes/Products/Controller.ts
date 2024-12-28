import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import {
  deleteFavorite,
  deleteProduct,
  editProduct,
  getProduct,
  getProductComments,
  getProductList,
  postProduct,
  postProductComment,
  setFavorite,
} from './service';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const router = express.Router();

router.get('/', asyncRequestHandler(getProductList));

router.get(
  '/:productId/comments',
  createAuthMiddleware(AUTH_MESSAGES.read),
  asyncRequestHandler(getProductComments),
);

router.get(
  '/:productId',
  createAuthMiddleware(AUTH_MESSAGES.read),
  asyncRequestHandler(getProduct),
);
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

router.post(
  '/:productId/favorite',
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(setFavorite),
);

router.delete(
  '/:productId/favorite',
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(deleteFavorite),
);

export default router;
