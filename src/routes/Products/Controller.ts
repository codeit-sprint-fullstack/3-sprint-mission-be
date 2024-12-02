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

const router = express.Router();

router.post('/', asyncRequestHandler(postProduct));
router.get('/:productId', asyncRequestHandler(getProduct));
router.post('/:productId', asyncRequestHandler(editProduct));
router.get('/', asyncRequestHandler(getProductList));
router.delete('/:productId', asyncRequestHandler(deleteProduct));
router.post('/:productId/comments', asyncRequestHandler(postProductComment));
router.get('/:productId/comments', asyncRequestHandler(getProductComments));

export default router;
