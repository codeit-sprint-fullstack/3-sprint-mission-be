import express from 'express';
import { ProductService } from './service';
import ProductRepository from '../../repositories/productRepository';
import FavoriteRepository from '../../repositories/favoriteRepository';
import CommentRepository from '../../repositories/commentRepository';
import { prismaClient } from '../../prismaClient';
import { ProductController } from './controller';
import { validateBody, validateQuery } from '../../middleware/validateMiddleware';
import {
  CreateProductRequestStruct,
  EditProductStruct,
  GetProductListRequestStruct,
} from '../../structs/ProductStruct';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { CreateCommentStruct, GetCommentListStruct } from '../../structs/CommentStruct';

const router = express.Router();

const productService = new ProductService(
  new ProductRepository(),
  new FavoriteRepository(),
  new CommentRepository(),
  prismaClient,
);

const productController = new ProductController(productService);

const {
  getProduct,
  postProduct,
  getProducts,
  editProduct,
  deleteProduct,
  postProductComment,
  getProductComments,
  setFavorite,
  deleteFavorite,
} = productController;

router
  .route('/')
  .get(validateQuery(GetProductListRequestStruct), asyncRequestHandler(getProducts))
  .post(
    validateBody(CreateProductRequestStruct),
    createAuthMiddleware(AUTH_MESSAGES.create),
    asyncRequestHandler(postProduct),
  );

router
  .route('/:productId')
  .get(createAuthMiddleware(AUTH_MESSAGES.read), asyncRequestHandler(getProduct))
  .patch(
    validateBody(EditProductStruct),
    createAuthMiddleware(AUTH_MESSAGES.update),
    asyncRequestHandler(editProduct),
  )
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteProduct));

router
  .route('/:productId/comments')
  .get(
    validateQuery(GetCommentListStruct),
    createAuthMiddleware(AUTH_MESSAGES.read),
    asyncRequestHandler(getProductComments),
  )
  .post(
    validateBody(CreateCommentStruct),
    createAuthMiddleware(AUTH_MESSAGES.create),
    asyncRequestHandler(postProductComment),
  );

router
  .route('/:productId/favorite')
  .post(createAuthMiddleware(AUTH_MESSAGES.create), asyncRequestHandler(setFavorite))
  .delete(createAuthMiddleware(AUTH_MESSAGES.delete), asyncRequestHandler(deleteFavorite));

export default router;
