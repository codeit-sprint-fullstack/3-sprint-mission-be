import express from 'express';
import productsRouter from './products/controller';
import aricleRouter from './article/controller';

const router = express.Router();

// products로 접근하면 productsRouter 연결
// router.use('/products', productsRouter);

// article로 접근하면 articleRouter 연결
router.use('/article', aricleRouter);

export default router;
