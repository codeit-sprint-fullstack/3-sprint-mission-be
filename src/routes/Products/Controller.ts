import express from 'express';
import asyncHandler from '../../utils/asyncHandler.ts';
import { editProduct, getProduct, postProduct } from './service.ts';

const router = express.Router();

router.post('/', asyncHandler(postProduct));
router.get('/:id', asyncHandler(getProduct));
router.post('/:id', asyncHandler(editProduct));

export default router;
