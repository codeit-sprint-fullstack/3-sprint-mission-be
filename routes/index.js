import express from 'express';
import productsRouter from './products/controller.js';

const Router = express.Router();

Router.use('/products', productsRouter);

export default Router;
