import express from 'express';
import productsRouter from './products/controller';

const router = express.Router();

// products로 접근하면 productsRouter 연결
router.use('/products', productsRouter);

export default router;
