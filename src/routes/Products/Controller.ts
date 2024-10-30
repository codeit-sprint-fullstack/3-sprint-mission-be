import express from 'express';
import asyncHandler from '../../utils/asyncHandler.ts';
import { getProduct, postProduct } from './service.ts';

const router = express.Router();

router.post('/', asyncHandler(postProduct));
router.get('/:id', asyncHandler(getProduct));

export default router;
