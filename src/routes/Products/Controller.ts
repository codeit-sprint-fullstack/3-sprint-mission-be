import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { deleteProduct, editProduct, getProduct, getProductList, postProduct } from './service';

const router = express.Router();

router.post('/', asyncRequestHandler(postProduct));
router.get('/:id', asyncRequestHandler(getProduct));
router.post('/:id', asyncRequestHandler(editProduct));
router.get('/', asyncRequestHandler(getProductList));
router.delete('/:id', asyncRequestHandler(deleteProduct));

export default router;
