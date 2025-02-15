import express from 'express';
import { ProductService } from './service/service';
import ProductRepository from '@/routes/Products/repository/productRepository';
import FavoriteRepository from '@/routes/Products/repository/favoriteRepository';
import CommentRepository from '@/routes/Comments/commentRepository';
import { prismaClient } from '@/prismaClient';
import { ProductController } from './controller/controller';
import { validateBody, validateQuery } from '@/core/middleware/validate';
import {
  CreateProductRequestStruct,
  EditProductStruct,
  GetProductListRequestStruct,
} from '@/structs/productStruct';
import asyncRequestHandler from '@/core/handlers/asyncRequestHandler';
import { createAuthMiddleware } from '@/core/middleware/auth/auth';
import { AUTH_MESSAGES } from '@/constants/authMessages';
import { CreateCommentStruct, GetCommentListStruct } from '@/structs/commentStruct';

const router = express.Router();

const productService = new ProductService(
  new ProductRepository(prismaClient),
  new FavoriteRepository(prismaClient),
  new CommentRepository(prismaClient),
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
