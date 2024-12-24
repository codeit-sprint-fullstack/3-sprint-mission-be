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

const authRouter = express.Router();

authRouter.post('/', createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(postProduct));
authRouter.patch(
  '/:productId',
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(editProduct),
);
authRouter.delete(
  '/:productId',
  createAuthMiddleware(AUTH_MESSAGES.delete),
  asyncRequestHandler(deleteProduct),
);
authRouter.post(
  '/:productId/comments',
  createAuthMiddleware(AUTH_MESSAGES.create),
  asyncRequestHandler(postProductComment),
);

router.use('/', authRouter);

export default router;
