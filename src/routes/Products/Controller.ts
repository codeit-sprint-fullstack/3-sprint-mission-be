import express from 'express';
import asyncHandler from '../../utils/asyncHandler.ts';
import { postProduct } from './service.ts';

const router = express.Router();

router.post('/', asyncHandler(postProduct));

export default router;
