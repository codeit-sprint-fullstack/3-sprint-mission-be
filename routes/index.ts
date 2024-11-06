import express from 'express';
import productsRouter from './products/controller';
import helloRouter from './hello/controller';

const router = express.Router();

// products로 접근하면 productsRouter 연결
router.use('/products', productsRouter);
router.use('/hello2', helloRouter);

export default router;
