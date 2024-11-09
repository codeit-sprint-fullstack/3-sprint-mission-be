import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { editProduct, getProduct, getProductList, postProduct } from './service';

const router = express.Router();

router.post('/', asyncRequestHandler(postProduct));
router.get('/:id', asyncRequestHandler(getProduct));
router.post('/:id', asyncRequestHandler(editProduct));
router.get('/', asyncRequestHandler(getProductList));

export default router;
