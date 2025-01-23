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

router
  .route('/')
  .get(asyncRequestHandler(getProductList))
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postProduct));

router
  .route('/:productId')
  .get(createAuthMiddleware(AUTH_MESSAGES.read), asyncRequestHandler(getProduct))
  .patch(createAuthMiddleware(AUTH_MESSAGES.update), asyncRequestHandler(editProduct))
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteProduct));

router
  .route('/:productId/comments')
  .get(createAuthMiddleware(AUTH_MESSAGES.read), asyncRequestHandler(getProductComments))
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postProductComment));

router
  .route('/:productId/favorite')
  .post(createAuthMiddleware(AUTH_MESSAGES.update), asyncRequestHandler(setFavorite))
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteFavorite));

export default router;
